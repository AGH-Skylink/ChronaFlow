import { act, renderHook } from "@testing-library/react-native";
import { useActiveTestState } from "@/hooks/useActiveTestState";
import { ExposureBasedPhase } from "@/src/domain/stp-tests/ExposureBasedTest";

type HookReturn = ReturnType<typeof useActiveTestState>;

describe("useActiveTestState", () => {
	let warnSpy: jest.SpyInstance;
	let errorSpy: jest.SpyInstance;

	beforeEach(() => {
		warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
		errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("runs a full active test cycle and resets hold duration", () => {
		const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.3);
		const nowSpy = jest.spyOn(Date, "now");
		nowSpy.mockReturnValueOnce(1_000); // start timer
		nowSpy.mockReturnValueOnce(1_800); // end timer
		nowSpy.mockReturnValue(2_000); // result id/timestamp fallback

		const { result } = renderHook<HookReturn, string | null>((sessionId) =>
			useActiveTestState(sessionId)
		, {
			initialProps: "session-1",
		});

		act(() => {
			expect(result.current.startTest()).toBe(true);
			result.current.beginExposure();
			result.current.completeExposure();
		});

		act(() => {
			expect(result.current.startTimer()).toBe(true);
		});

		let producedResult = null as ReturnType<HookReturn["endTimer"]>;
		act(() => {
			producedResult = result.current.endTimer();
		});

		expect(producedResult).not.toBeNull();
		expect(result.current.state).toBe(ExposureBasedPhase.RESULTS);
		expect(result.current.holdDuration).toBe(800);

		act(() => {
			expect(result.current.complete()).toBe(true);
		});

		expect(result.current.state).toBe(ExposureBasedPhase.COMPLETED);

		act(() => {
			expect(result.current.startTest()).toBe(true);
		});

		expect(result.current.holdDuration).toBeNull();

		randomSpy.mockRestore();
		nowSpy.mockRestore();
	});

	it("refuses to start the timer outside reproduction phase", () => {
		const { result } = renderHook<HookReturn, string | null>((sessionId) =>
			useActiveTestState(sessionId)
		, {
			initialProps: null,
		});

		act(() => {
			expect(result.current.startTimer()).toBe(false);
		});

		expect(warnSpy).toHaveBeenCalled();
	});

	it("returns null when ending without starting the timer", () => {
		const { result } = renderHook<HookReturn, string | null>((sessionId) =>
			useActiveTestState(sessionId)
		, {
			initialProps: "session-3",
		});

		act(() => {
			result.current.startTest();
			result.current.beginExposure();
			result.current.completeExposure();
		});

		let outcome = null as ReturnType<HookReturn["endTimer"]>;
		act(() => {
			outcome = result.current.endTimer();
		});

		expect(outcome).toBeNull();
		expect(result.current.holdDuration).toBeNull();
		expect(errorSpy).toHaveBeenCalled();
	});

	it("syncs state after direct mutations on the test instance", () => {
		const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.2);
		const { result } = renderHook<HookReturn, string | null>((sessionId) =>
			useActiveTestState(sessionId)
		, {
			initialProps: "session-sync",
		});

		act(() => {
			result.current.test.startTest();
		});

		expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);

		act(() => {
			result.current.syncState();
		});

		expect(result.current.state).toBe(ExposureBasedPhase.COUNTDOWN);

		randomSpy.mockRestore();
	});
});
