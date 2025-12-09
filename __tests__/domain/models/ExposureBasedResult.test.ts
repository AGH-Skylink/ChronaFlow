import { ExposureBasedResult } from "@/src/domain/models/ExposureBasedResult";

describe("ExposureBasedResult", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("creates a result with generated metadata", () => {
		const dateSpy = jest.spyOn(Date, "now");
		dateSpy.mockReturnValueOnce(3333).mockReturnValueOnce(4444);
		const randomSpy = jest.spyOn(Math, "random").mockReturnValue(0.42);

		const result = ExposureBasedResult.create(2000, 1800, "session-x");

		expect(result.id).toMatch(/^3333-[a-z0-9]{6}$/);
		expect(result.timestamp).toBe(4444);
		expect(result.targetDuration).toBe(2000);
		expect(result.userDuration).toBe(1800);
		expect(result.notes).toBe("");
		expect(result.sessionId).toBe("session-x");

		randomSpy.mockRestore();
	});

	it("throws for export and clear until implemented", () => {
		const result = new ExposureBasedResult("id", 1000, 2000, 1800);

		expect(() => result.export()).toThrow("Method not implemented.");
		expect(() => result.clear()).toThrow("Method not implemented.");
	});
});
