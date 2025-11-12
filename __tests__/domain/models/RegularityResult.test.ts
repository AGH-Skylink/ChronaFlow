import { RegularityResult } from "@/src/domain/models/RegularityResult";

describe("RegularityResult", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("creates a result with generated id and timestamp", () => {
		const dateSpy = jest.spyOn(Date, "now");
		dateSpy.mockReturnValueOnce(1111).mockReturnValueOnce(2222);
		const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.75);

		const tapTimestamps = [1000, 2000, 3000];
		const result = RegularityResult.create(1500, 250, tapTimestamps, "session-1");

		expect(result.id).toMatch(/^1111-[a-z0-9]{6}$/);
		expect(result.timestamp).toBe(2222);
		expect(result.avgInterval).toBe(1500);
		expect(result.stdDevInterval).toBe(250);
		expect(result.tapTimestamps).toStrictEqual(tapTimestamps);
		expect(result.notes).toBe("");
		expect(result.sessionId).toBe("session-1");

		randomSpy.mockRestore();
	});

	it("throws for unsupported export and clear operations", () => {
		const result = new RegularityResult(
			"id",
			1000,
			1500,
			200,
			[1000, 2000]
		);

		expect(() => result.export()).toThrow("Method not implemented.");
		expect(() => result.clear()).toThrow("Method not implemented.");
	});
});
