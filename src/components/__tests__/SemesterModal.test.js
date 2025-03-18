import { calculateSemesterGrade } from "../components/SemesterModal";

describe("calculateSemesterGrade function", () => {
  test("calculates the correct semester grade", () => {
    const courses = [
      { finalGrade: 18, credits: 5 },
      { finalGrade: 15, credits: 3 },
    ];
    expect(calculateSemesterGrade(courses)).toBe("17.13"); // (18*5 + 15*3) / (5+3)
  });

  test("returns 'N/A' when no courses are provided", () => {
    expect(calculateSemesterGrade([])).toBe("N/A");
  });

  test("handles courses with missing credits", () => {
    const courses = [
      { finalGrade: 18, credits: 5 },
      { finalGrade: 15 }, // Missing credits
    ];
    expect(calculateSemesterGrade(courses)).toBe("18.00"); // (18*5 + 15*0) / 5
  });

  test("handles courses with missing finalGrade", () => {
    const courses = [
      { finalGrade: 18, credits: 5 },
      { credits: 3 }, // Missing finalGrade
    ];
    expect(calculateSemesterGrade(courses)).toBe("18.00"); // (18*5 + 0*3) / (5+3)
  });

  test("handles courses with non-numeric finalGrade values", () => {
    const courses = [
      { finalGrade: "18", credits: 5 }, // String instead of number
      { finalGrade: "15", credits: 3 },
    ];
    expect(calculateSemesterGrade(courses)).toBe("17.13"); // Ensure conversion works
  });

  test("handles courses with zero credits", () => {
    const courses = [
      { finalGrade: 18, credits: 5 },
      { finalGrade: 15, credits: 0 }, // Zero credits
    ];
    expect(calculateSemesterGrade(courses)).toBe("18.00"); // Ignore zero-credit courses
  });

  test("handles all zero-credit courses", () => {
    const courses = [
      { finalGrade: 18, credits: 0 },
      { finalGrade: 15, credits: 0 },
    ];
    expect(calculateSemesterGrade(courses)).toBe("N/A"); // No valid grades to calculate
  });
});
