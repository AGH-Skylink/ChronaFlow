import { act, renderHook } from "@testing-library/react-native";
import {
  ExposureBasedPhase,
  ExposureBasedTest,
} from "@/src/domain/stp-tests/ExposureBasedTest";
import { useExposureBasedTestState } from "@/hooks/useExposureBasedTestState";

class MockExposureTest extends ExposureBasedTest {
  private static emojiIndex = 0;
  static resetEmojiCycle() {
    this.emojiIndex = 0;
  }

  randomTimeMillis(): number {
    return 2500;
  }

  randomEmoji(): string {
    const emojis = ["😀", "😎", "🤖", "🦊"];
    const emoji = emojis[MockExposureTest.emojiIndex % emojis.length];
    MockExposureTest.emojiIndex += 1;
    return emoji;
  }

  calculateUserExposure(): void {
    this._userExposure = 1234;
  }

  forceState(state: ExposureBasedPhase) {
    this._state = state;
  }
}

const useHook = (sessionId: string | null) =>
  useExposureBasedTestState(MockExposureTest, sessionId);

type HookReturn = ReturnType<typeof useHook>;
type HookProps = { sessionId: string | null };

describe("useExposureBasedTestState", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    MockExposureTest.resetEmojiCycle();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("initialises with inactive state and emoji", () => {
    const { result } = renderHook<HookReturn, HookProps>(
      ({ sessionId }) => useHook(sessionId),
      {
        initialProps: { sessionId: "session-1" },
      }
    );

    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);
    expect(result.current.targetExposure).toBe(0);
    expect(result.current.emoji).toBe("😀");
  });

  it("transitions through countdown and exposure phases", () => {
    const { result } = renderHook<HookReturn, HookProps>(
      ({ sessionId }) => useHook(sessionId),
      {
        initialProps: { sessionId: null },
      }
    );

    act(() => {
      expect(result.current.startTest()).toBe(true);
    });

    expect(result.current.state).toBe(ExposureBasedPhase.COUNTDOWN);
    expect(result.current.targetExposure).toBe(2500);
    expect(result.current.emoji).toBe("😎");

    act(() => {
      expect(result.current.beginExposure()).toBe(true);
    });
    expect(result.current.state).toBe(ExposureBasedPhase.EXPOSURE);

    act(() => {
      expect(result.current.completeExposure()).toBe(true);
    });
    expect(result.current.state).toBe(ExposureBasedPhase.REPRODUCTION);
  });

  it("prevents invalid transitions", () => {
    const { result } = renderHook<HookReturn, void>(() => useHook(null));

    act(() => {
      expect(result.current.beginExposure()).toBe(false);
    });

    act(() => {
      expect(result.current.completeExposure()).toBe(false);
    });

    act(() => {
      expect(result.current.complete()).toBe(false);
    });
  });

  it("moves to completed state when results are available", () => {
    const { result } = renderHook<HookReturn, void>(() => useHook("session-2"));

    act(() => {
      result.current.startTest();
      result.current.beginExposure();
      result.current.completeExposure();
    });

    act(() => {
      result.current.test.forceState(ExposureBasedPhase.RESULTS);
      expect(result.current.complete()).toBe(true);
    });

    expect(result.current.state).toBe(ExposureBasedPhase.COMPLETED);
  });

  it("resets state and emoji", () => {
    const { result } = renderHook<HookReturn, void>(() =>
      useHook("session-reset")
    );

    act(() => {
      result.current.startTest();
    });

    const emojiAfterStart = result.current.emoji;

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);
    expect(result.current.targetExposure).toBe(0);
    expect(result.current.emoji).not.toBe(emojiAfterStart);
  });

  it("syncs state changes performed directly on the test instance", () => {
    const { result } = renderHook<HookReturn, void>(() =>
      useHook("session-sync")
    );

    act(() => {
      result.current.test.startTest();
    });

    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);

    act(() => {
      result.current.syncState();
    });

    expect(result.current.state).toBe(ExposureBasedPhase.COUNTDOWN);
  });

  it("reinitialises when the session changes", () => {
    const { result, rerender } = renderHook<HookReturn, HookProps>(
      ({ sessionId }) => useHook(sessionId),
      {
        initialProps: { sessionId: "session-a" },
      }
    );

    act(() => {
      result.current.startTest();
    });
    expect(result.current.state).toBe(ExposureBasedPhase.COUNTDOWN);

    rerender({ sessionId: "session-b" });

    expect(result.current.test.sessionId).toBe("session-b");
    expect(result.current.state).toBe(ExposureBasedPhase.INACTIVE);
    expect(result.current.targetExposure).toBe(0);
  });
});
