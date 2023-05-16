import { assert, describe, expect, test } from "vitest";
import { asDateComponents, asDayOfWeek, asHTMLInputDateValue, WeekEnum, WEEK_DAYS } from "../../src/lib/date";

describe("warmup testrun", () => {
  test("Math.sqrt()", () => {
    expect(Math.sqrt(4)).toBe(2);
    expect(Math.sqrt(144)).toBe(12);
    expect(Math.sqrt(2)).toBe(Math.SQRT2);
  });

  test("JSON", () => {
    const input = {
      foo: "hello",
      bar: "world",
    };
    const output = JSON.stringify(input);
    expect(output).eq('{"foo":"hello","bar":"world"}');
    assert.deepEqual(JSON.parse(output), input, "matches original");
  });
});

describe("lib/date.ts/", () => {
  describe("asDateComponents", () => {
    test("should return today's date, month, and year", () => {
      const date = new Date();
      const ymd = asDateComponents(date);
      expect(date.getDate()).toBe(ymd.date);
      assert.equal(date.getMonth(), ymd.month);
      assert.equal(date.getFullYear(), ymd.year);
    })

    test("should throw error if date.getTime() is not a function", () => {
      const date = "" as unknown as Date;
      assert.throw(() => asDateComponents(date));
    })

    test("should throw error if date has invalid date format", () => {
      const date = new Date("2023-01-01a");
      expect(() => asDateComponents(date)).toThrowError("Invalid date format");
    })
  });

  describe("asHTMLInputDateValue", () => {
    test("should convert Date object to string of pattern `yy-mm-dd`", () => {
      const actual = "2023-01-01";
      const date = new Date(actual);
      assert.equal(actual, asHTMLInputDateValue(date));
    });

    test("should throw error if date has invalid date format", () => {
      const date = new Date("2023-01-01a");
      expect(() => asHTMLInputDateValue(date)).toThrowError("Invalid date format");
    });
  });


  describe("asDayOfWeek", () => {
    test("should return the day of week of param type Date", () => {
      const actual = "2023-01-01";
      const date = new Date(actual);
      assert.equal("Sunday", asDayOfWeek(date).weekDay);
    });

    test("should return the day of week as `WeekEnum` of param type Date", () => {
      const actual = "2023-01-01";
      const date = new Date(actual);
      assert.equal(WEEK_DAYS[WeekEnum.Sunday], asDayOfWeek(date).weekDayEnum);
      assert.equal(Object.values(WeekEnum)[WeekEnum.Sunday], asDayOfWeek(date).weekDayEnum);
      assert.equal(Object.values(WeekEnum)[0], asDayOfWeek(date).weekDayEnum);
    });

    test("should throw error if date has invalid date format", () => {
      const date = new Date("2023-01-01a");
      expect(() => asDayOfWeek(date)).toThrowError("Invalid date format");
    });
  });

  describe("WeekEnum", () => {
    test("should match days of week from 0 to 6", () => {
      const LEN_WEEK = 7;

      const weekValues: (string | WeekEnum)[] = Object.values(WeekEnum);
      const weekKeys: string[] = Object.keys(WeekEnum);
      const weekEntries: [string, string | WeekEnum][] = Object.entries(WeekEnum);

      const expectedWeekValues = weekValues.slice(0, LEN_WEEK);

      assert.equal(LEN_WEEK, WEEK_DAYS.length);
      assert.equal(LEN_WEEK * 2, weekKeys.length);
      expect(weekKeys).toHaveLength(LEN_WEEK * 2);
      expect(weekValues).toHaveLength(LEN_WEEK * 2);

      weekValues.forEach((_value, index) => {
        expect(WEEK_DAYS[index]).toBe(expectedWeekValues[index]);
      });

      weekKeys.forEach((key, index) => {
        if (index < LEN_WEEK) {
          expect(key).toBe(index.toString());
        } else {
          const normalizedIndex = index % LEN_WEEK;
          expect(WeekEnum[normalizedIndex]).toBe(key);
        }
      });

      for (let i = 0; i < LEN_WEEK; i++) {
        const actual: [string, string | WeekEnum] = weekEntries[i];
        const expected: [string, string] = [i.toString(), WeekEnum[i].toString()];
        assert.strictEqual(actual[0], expected[0]);
        assert.strictEqual(actual[1], expected[1]);
      }
    })
  });
})
