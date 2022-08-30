const AWS = require("aws-sdk");
const uuid = require("uuid");
const { create } = require("../src/index");

describe("functions", () => {
  describe("create", () => {
    it("should return a response", async () => {
      const book = {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        isbn: "0-395-19395-8",
        publisher: "Allen & Unwin",
        genre: "Fantasy",
      };
      // mock dynamodb
      AWS.DynamoDB.DocumentClient.prototype.put = jest.fn().mockReturnValue({
        promise: jest.fn(),
      });

      // mock uuid
      const id = "12345";
      uuid.v4 = jest.fn().mockReturnValue(id);

      // mock date
      const date = new Date("2019-01-01T00:00:00.000Z");
      Date.now = jest.fn().mockReturnValue(date);

      const event = {
        body: JSON.stringify(book),
      };

      const callback = jest.fn();

      await create(event, {}, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        statusCode: 200,
        body: JSON.stringify({ id, ...book, updatedAt: date }),
      });
    });

    test("should return a 400 if no title is provided", async () => {
      const book = {
        title: "",
      };
      // mock dynamodb
      AWS.DynamoDB.DocumentClient.prototype.put = jest.fn().mockReturnValue({
        promise: jest.fn(),
      });

      const event = {
        body: JSON.stringify(book),
      }


      const callback = jest.fn();

      await create(event, {}, callback);
      expect(callback).toHaveBeenCalledWith(null, {
        statusCode: 400,
        body: JSON.stringify({
          message: "Title is required",
        }),
      });
    });
  });

});
