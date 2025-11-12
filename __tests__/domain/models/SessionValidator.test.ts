import { SessionValidator } from "@/src/domain/models/SessionValidator";
import { Session, SessionBlock } from "@/types/session";

describe("SessionValidator", () => {
	const buildBlocks = (count: number): SessionBlock[] =>
		Array.from({ length: count }, (_, index) => ({
			id: `block-${index}`,
			order: index,
			type: "active",
		}));

	describe("validateSessionName", () => {
		it("rejects empty names", () => {
			const result = SessionValidator.validateSessionName("");
			expect(result).toEqual({
				isValid: false,
				error: "Please enter a session name",
			});
		});

		it("rejects names that exceed the maximum length", () => {
			const longName = "a".repeat(101);
			const result = SessionValidator.validateSessionName(longName);
			expect(result).toEqual({
				isValid: false,
				error: "Session name must be less than 100 characters",
			});
		});

		it("accepts trimmed valid names", () => {
			const result = SessionValidator.validateSessionName("  ChronaFlow Session  ");
			expect(result).toEqual({ isValid: true });
		});
	});

	describe("validateBlockCount", () => {
		it("requires at least one block", () => {
			const result = SessionValidator.validateBlockCount([]);
			expect(result).toEqual({
				isValid: false,
				error: "Please add at least one test block",
			});
		});

		it("rejects more than the maximum block count", () => {
			const result = SessionValidator.validateBlockCount(buildBlocks(51));
			expect(result).toEqual({
				isValid: false,
				error: "Session cannot have more than 50 test blocks",
			});
		});

		it("accepts a valid block list", () => {
			const result = SessionValidator.validateBlockCount(buildBlocks(5));
			expect(result).toEqual({ isValid: true });
		});
	});

	describe("helpers", () => {
		it("canAddBlock respects the maximum", () => {
			expect(SessionValidator.canAddBlock(0)).toBe(true);
			expect(SessionValidator.canAddBlock(49)).toBe(true);
			expect(SessionValidator.canAddBlock(50)).toBe(false);
		});

		it("canRemoveBlock validates the id", () => {
			const blocks = buildBlocks(3);
			expect(SessionValidator.canRemoveBlock(blocks, "block-1")).toBe(true);
			expect(SessionValidator.canRemoveBlock(blocks, "missing")).toBe(false);
		});

		it("canMoveBlockUp checks bounds", () => {
			const blocks = buildBlocks(3);
			expect(SessionValidator.canMoveBlockUp(blocks, 0)).toBe(false);
			expect(SessionValidator.canMoveBlockUp(blocks, 1)).toBe(true);
			expect(SessionValidator.canMoveBlockUp(blocks, 3)).toBe(false);
		});

		it("canMoveBlockDown checks bounds", () => {
			const blocks = buildBlocks(3);
			expect(SessionValidator.canMoveBlockDown(blocks, 0)).toBe(true);
			expect(SessionValidator.canMoveBlockDown(blocks, 1)).toBe(true);
			expect(SessionValidator.canMoveBlockDown(blocks, 2)).toBe(false);
		});
	});

	describe("validateSession", () => {
		const buildSession = (blocks: SessionBlock[]): Session => ({
			id: "session-id",
			name: "Session",
			createdAt: Date.now(),
			blocks,
		});

		it("returns the first failing validation", () => {
			const session = buildSession([]);
			const result = SessionValidator.validateSession(session, "");
			expect(result).toEqual({
				isValid: false,
				error: "Please enter a session name",
			});
		});

		it("passes when both name and blocks are valid", () => {
			const session = buildSession(buildBlocks(2));
			const result = SessionValidator.validateSession(session, "Valid name");
			expect(result).toEqual({ isValid: true });
		});
	});
});
