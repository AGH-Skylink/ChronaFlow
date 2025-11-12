import { act, renderHook } from "@testing-library/react-native";
import type { RegularityResult } from "@models/RegularityResult";
import { useRegularityTestState } from "@/hooks/useRegularityTestState";
import { RegularityPhase, TAP_COUNT } from "@stp-tests/RegularityTest";

describe("useRegularityTestState", () => {
  const sessionId = "session-123";
  const baseTime = new Date("2024-01-01T00:00:00Z").getTime();
  const intervalMs = 1_000;

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("initializes with an inactive phase and zeroed metrics", () => {
    const { result } = renderHook(() => useRegularityTestState(sessionId));

    expect(result.current.state).toBe(RegularityPhase.INACTIVE);
    expect(result.current.tapCount).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.avgInterval).toBe(0);
    expect(result.current.stdDevInterval).toBe(0);
  });

  it("enters countdown and clears previous progress when startTest is called", () => {
    const { result } = renderHook(() => useRegularityTestState(sessionId));

    let didStart = false;
    act(() => {
      didStart = result.current.startTest();
    });

    expect(didStart).toBe(true);
    expect(result.current.state).toBe(RegularityPhase.COUNTDOWN);
    expect(result.current.tapCount).toBe(0);
    expect(result.current.isComplete).toBe(false);
  });

  it("tracks taps and flags completion once the required tap count is reached", () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useRegularityTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginTapping();
    });

    let didComplete = false;
    act(() => {
      jest.setSystemTime(baseTime);
      didComplete = result.current.recordTap();
    });
    expect(didComplete).toBe(false);
    expect(result.current.tapCount).toBe(1);
    expect(result.current.state).toBe(RegularityPhase.TAPPING);

    act(() => {
      jest.setSystemTime(baseTime + intervalMs);
      didComplete = result.current.recordTap();
    });
    expect(didComplete).toBe(false);
    expect(result.current.tapCount).toBe(2);

    act(() => {
      for (let i = 2; i < TAP_COUNT; i++) {
        jest.setSystemTime(baseTime + i * intervalMs);
        didComplete = result.current.recordTap();
      }
    });
    expect(didComplete).toBe(true);
    expect(result.current.tapCount).toBe(TAP_COUNT);
    expect(result.current.state).toBe(RegularityPhase.RESULTS);
    expect(result.current.isComplete).toBe(true);
  });

  it("analyzes taps and updates aggregate metrics", () => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const { result } = renderHook(() => useRegularityTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginTapping();
      for (let i = 0; i < TAP_COUNT; i++) {
        jest.setSystemTime(baseTime + i * intervalMs);
        result.current.recordTap();
      }
    });

    let analysis: RegularityResult | null = null;
    act(() => {
      analysis = result.current.analyzeResults();
    });

    expect(analysis).not.toBeNull();
    if (!analysis) {
      throw new Error("analysis should never be null after successful taps");
    }
    const typedAnalysis = analysis as RegularityResult;
    expect(typedAnalysis.avgInterval).toBeCloseTo(1, 5);
    expect(typedAnalysis.stdDevInterval).toBeCloseTo(0, 5);
    const expectedTimestamps = Array.from(
      { length: TAP_COUNT },
      (_, index) => index * intervalMs
    );
    expect(typedAnalysis.tapTimestamps).toEqual(expectedTimestamps);
    expect(typedAnalysis.sessionId).toBe(sessionId);

    expect(result.current.avgInterval).toBeCloseTo(1, 5);
    expect(result.current.stdDevInterval).toBeCloseTo(0, 5);
    expect(result.current.state).toBe(RegularityPhase.RESULTS);
  });

  it("transitions to completed state after finalize", () => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const { result } = renderHook(() => useRegularityTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginTapping();
      for (let i = 0; i < TAP_COUNT; i++) {
        jest.setSystemTime(baseTime + i * intervalMs);
        result.current.recordTap();
      }
      result.current.analyzeResults();
    });

    let didComplete: boolean | null = null;
    act(() => {
      didComplete = result.current.complete();
    });

    expect(didComplete).toBe(true);
    expect(result.current.state).toBe(RegularityPhase.COMPLETED);
  });

  it("resets the internal timers and progress", () => {
    jest
      .spyOn(Date, "now")
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(2_000)
      .mockReturnValueOnce(3_000);

    const { result } = renderHook(() => useRegularityTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginTapping();
      result.current.recordTap();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe(RegularityPhase.INACTIVE);
    expect(result.current.tapCount).toBe(0);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.avgInterval).toBe(0);
    expect(result.current.stdDevInterval).toBe(0);
  });
});
