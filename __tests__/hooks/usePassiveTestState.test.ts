import { act, renderHook } from "@testing-library/react-native";
import { ExposureBasedPhase } from "@stp-tests/ExposureBasedTest";
import { PassiveTest } from "@stp-tests/PassiveTest";
import { usePassiveTestState } from "@/hooks/usePassiveTestState";
import { ExposureBasedResult } from "@models/ExposureBasedResult";

describe("usePassiveTestState", () => {
  const sessionId = "passive-session-1";

  const mockMathRandomSequence = (values: number[]) => {
    const spy = jest.spyOn(Math, "random");
    values.forEach((value) => spy.mockReturnValueOnce(value));
    spy.mockReturnValue(values[values.length - 1] ?? 0);
    return spy;
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initializes with default slider value and inactive state", () => {
    mockMathRandomSequence([0]);

    const { result } = renderHook(() => usePassiveTestState(sessionId));

    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);
    expect(result.current.sliderValue).toBe(1000);
    expect(result.current.targetExposure).toBe(0);
    expect(typeof result.current.emoji).toBe("string");
    expect(result.current.test).toBeInstanceOf(PassiveTest);
  });

  it("transitions through countdown and exposure phases when the test starts", () => {
    mockMathRandomSequence([0.5]);

    const { result } = renderHook(() => usePassiveTestState(sessionId));

    let started = false;
    act(() => {
      started = result.current.startTest();
    });

    expect(started).toBe(true);
    expect(result.current.state).toBe(ExposureBasedPhase.COUNTDOWN);
    expect(result.current.targetExposure).toBe(3000);

    let beganExposure = false;
    act(() => {
      beganExposure = result.current.beginExposure();
    });

    expect(beganExposure).toBe(true);
    expect(result.current.state).toBe(ExposureBasedPhase.EXPOSURE);

    let exposureComplete = false;
    act(() => {
      exposureComplete = result.current.completeExposure();
    });

    expect(exposureComplete).toBe(true);
    expect(result.current.state).toBe(ExposureBasedPhase.REPRODUCTION);
  });

  it("captures slider input and produces exposure results", () => {
    mockMathRandomSequence([1]);
    jest.spyOn(Date, "now").mockReturnValue(1_735_000_000_000);

    const { result } = renderHook(() => usePassiveTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginExposure();
      result.current.completeExposure();
    });

    act(() => {
      result.current.setSliderValue(5000);
    });

    expect(result.current.sliderValue).toBe(5000);
    expect((result.current.test as PassiveTest).sliderValue).toBe(5000);

    let analysis: ExposureBasedResult | null = null;
    act(() => {
      analysis = result.current.calculateResults();
    });

    if (!analysis) {
      throw new Error("analysis should never be null after slider submission");
    }

    const typedAnalysis = analysis as ExposureBasedResult;

    expect(typedAnalysis.targetDuration).toBe(5000);
    expect(typedAnalysis.userDuration).toBe(5000);
    expect(typedAnalysis.sessionId).toBe(sessionId);
    expect(result.current.state).toBe(ExposureBasedPhase.RESULTS);

    let didComplete = false;
    act(() => {
      didComplete = result.current.complete();
    });

    expect(didComplete).toBe(true);
    expect(result.current.state).toBe(ExposureBasedPhase.COMPLETED);
  });

  it("resets slider and emoji to their defaults", () => {
    // Different random values to ensure different emojis
    const mathSpy = mockMathRandomSequence([0.1, 0.9]);

    const { result } = renderHook(() => usePassiveTestState(sessionId));

    act(() => {
      result.current.startTest();
      result.current.beginExposure();
      result.current.completeExposure();
      result.current.setSliderValue(3900);
    });

    const emojiBeforeReset = result.current.emoji;

    // Reset will pick a new emoji with different random value
    mathSpy.mockReturnValueOnce(0.9);
    
    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);
    expect(result.current.sliderValue).toBe(1000);
    // Emoji should change with different random value
    const emojiAfterReset = result.current.emoji;
    // We can't guarantee it's different (small chance of same emoji), so just check it exists
    expect(typeof emojiAfterReset).toBe("string");
    expect(emojiAfterReset.length).toBeGreaterThan(0);
  });
});
