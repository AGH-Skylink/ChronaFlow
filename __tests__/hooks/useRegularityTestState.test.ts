import { act, renderHook } from "@testing-library/react-native";
import type { RegularityResult } from "@models/RegularityResult";
import { useRegularityTestState } from "@/hooks/useRegularityTestState";
import { RegularityPhase, TAP_COUNT } from "@stp-tests/RegularityTest";

describe("useRegularityTestState", () => {
	const sessionId = "session-123";

	afterEach(() => {
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
		const dateSpy = jest
			.spyOn(Date, "now")
			.mockReturnValueOnce(1_000)
			.mockReturnValueOnce(2_000)
			.mockReturnValueOnce(3_000);

		const { result } = renderHook(() => useRegularityTestState(sessionId));

		act(() => {
			result.current.startTest();
			result.current.beginTapping();
		});

		let didComplete = false;
		act(() => {
			didComplete = result.current.recordTap();
		});
		expect(didComplete).toBe(false);
		expect(result.current.tapCount).toBe(1);
		expect(result.current.state).toBe(RegularityPhase.TAPPING);

		act(() => {
			didComplete = result.current.recordTap();
		});
		expect(didComplete).toBe(false);
		expect(result.current.tapCount).toBe(2);

		act(() => {
			didComplete = result.current.recordTap();
		});
		expect(didComplete).toBe(true);
		expect(dateSpy).toHaveBeenCalledTimes(TAP_COUNT);
		expect(result.current.tapCount).toBe(TAP_COUNT);
		expect(result.current.state).toBe(RegularityPhase.RESULTS);
		expect(result.current.isComplete).toBe(true);
	});

	it("analyzes taps and updates aggregate metrics", () => {
		const dateSpy = jest
			.spyOn(Date, "now")
			.mockReturnValueOnce(1_000)
			.mockReturnValueOnce(2_000)
			.mockReturnValueOnce(3_000)
			.mockReturnValueOnce(4_000)
			.mockReturnValueOnce(5_000);
		jest.spyOn(Math, "random").mockReturnValue(0.5);

		const { result } = renderHook(() => useRegularityTestState(sessionId));

		act(() => {
			result.current.startTest();
			result.current.beginTapping();
			result.current.recordTap();
			result.current.recordTap();
			result.current.recordTap();
		});

		let analysis: RegularityResult | null = null;
		act(() => {
			analysis = result.current.analyzeResults();
		});

			expect(dateSpy).toHaveBeenCalledTimes(5);
			expect(analysis).not.toBeNull();
				if (!analysis) {
					throw new Error("analysis should never be null after successful taps");
				}
				const typedAnalysis = analysis as RegularityResult;
				expect(typedAnalysis.avgInterval).toBeCloseTo(1, 5);
				expect(typedAnalysis.stdDevInterval).toBeCloseTo(0, 5);
				expect(typedAnalysis.tapTimestamps).toEqual([0, 1_000, 2_000]);
				expect(typedAnalysis.sessionId).toBe(sessionId);

		expect(result.current.avgInterval).toBeCloseTo(1, 5);
		expect(result.current.stdDevInterval).toBeCloseTo(0, 5);
		expect(result.current.state).toBe(RegularityPhase.RESULTS);
	});

	it("transitions to completed state after finalize", () => {
		jest
			.spyOn(Date, "now")
			.mockReturnValueOnce(1_000)
			.mockReturnValueOnce(2_000)
			.mockReturnValueOnce(3_000)
			.mockReturnValueOnce(4_000)
			.mockReturnValueOnce(5_000);
		jest.spyOn(Math, "random").mockReturnValue(0.5);

		const { result } = renderHook(() => useRegularityTestState(sessionId));

		act(() => {
			result.current.startTest();
			result.current.beginTapping();
			result.current.recordTap();
			result.current.recordTap();
			result.current.recordTap();
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
