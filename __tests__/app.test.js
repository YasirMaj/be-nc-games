const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/categories", () => {
  test("GET - status:200, responds with an array of categories objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("GET - status:200, responds with an array of reviews objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("GET - status:200, can order array of games by descending date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET - status:404, bad URL request", () => {
  test("GET - status:404, not found", () => {
    return request(app)
      .get("/api/badurl")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL!");
      });
  });
});

describe("GET /reviews/:review_id", () => {
  test("GET - status:200, responds with a review object", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toBeInstanceOf(Object);
        expect.objectContaining({
          review_id: 1,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET - status:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("ID not Found!");
      });
  });
  test("GET - status:400 sends an appropriate error message when given a invalid id (wrong data type)", () => {
    return request(app)
      .get("/api/reviews/something-bad")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
});

describe("GET /reviews/:review_id/comments", () => {
  test("GET - status:200, responds with an array of comment objects", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 2,
            })
          );
        });
      });
  });
  test("GET - status:200, responds with a comment object with the correct content", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments[0]).toEqual(
          expect.objectContaining({
            comment_id: 5,
            votes: 13,
            created_at: "2021-01-18T10:24:05.410Z",
            author: "mallionaire",
            body: "Now this is a story all about how, board games turned my life upside down",
            review_id: 2,
          })
        );
      });
  });
  test("GET - status:200, can order array of comments by descending date", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET - status:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found");
      });
  });
  test("GET - status:400 sends an appropriate error message when given a invalid id (wrong data type)", () => {
    return request(app)
      .get("/api/reviews/something-bad/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
  test("GET - status:200 sends an empty array when review_id has no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
});
