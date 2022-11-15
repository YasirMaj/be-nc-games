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
  test("GET - status:404, not found", () => {
    return request(app)
      .get("/api/badurl")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL!");
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
        expect(reviews).toBeSortedBy("created_at", {descending: true});
      });
  });
  test("GET - status:404, not found", () => {
    return request(app)
      .get("/api/badurl")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid URL!");
      });
  });
});
