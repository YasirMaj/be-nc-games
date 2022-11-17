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
  test("GET - status:200, can order array of reviews by descending date by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET - status:200, can order array of reviews by ascending value", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at");
      });
  });
  test("GET - status:400, invalid order query!", () => {
    return request(app)
      .get("/api/reviews?order=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Order Query!");
      });
  });
  test("GET - status:200, can sort array of reviews by specified sort_by value", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
          expect(reviews).toBeSortedBy("title", { descending: true });;
      });
  });
  test("GET - status:400, invalid sort query!", () => {
    return request(app)
      .get("/api/reviews?sort_by=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Sort Query!");
      });
  });
  test("GET - status:200, can filter reviews by category", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  test("GET - status:200, can filter reviews by category and will return empty array if no reviews for chosen category", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(0);
      });
  });
  test("GET - status:404, invalid filter query!", () => {
    return request(app)
      .get("/api/reviews?category=something bad")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found!");
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
          comment_count: "0",
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
        expect(res.body.msg).toBe("Resource not found!");
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

describe("POST /api/reviews/:review_id/comments", () => {
  test("POST - status:201, inserts a new comment into the database and responds with newly added comment", () => {
    const newComment = {
      username: "dav3rid",
      body: "My kids loved it",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 7,
          review_id: 1,
          votes: 0,
          created_at: expect.any(String),
          author: "dav3rid",
          body: "My kids loved it",
        });
      });
  });
  test("POST - status:201, inserts a new comment into the database and responds with newly added comment ignoring unnecessary properties", () => {
    const newComment = {
      username: "dav3rid",
      body: "My kids loved it",
      unnecessary_key: "unnecessary information",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 7,
          review_id: 1,
          votes: 0,
          created_at: expect.any(String),
          author: "dav3rid",
          body: "My kids loved it",
        });
      });
  });
  test("POST - status:400, responds with an appropriate error message when provided with a bad comment (eg no username)", () => {
    const newComment = {
      body: "My kids loved it",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Missing Input Data!");
      });
  });
  test("POST - status:404 sends an appropriate error message when given an non-existent username", () => {
    const newComment = {
      username: "Kev",
      body: "My kids loved it",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found!");
      });
  });
  test("POST - status:404 sends an appropriate error message when given a valid but non-existent id", () => {
    const newComment = {
      username: "dav3rid",
      body: "My kids loved it",
    };
    return request(app)
      .post("/api/reviews/999/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found!");
      });
  });
  test("POST - status:400 sends an appropriate error message when given a invalid id (wrong data type)", () => {
    const newComment = {
      username: "dav3rid",
      body: "My kids loved it",
    };
    return request(app)
      .post("/api/reviews/something-bad/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request!");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH - status:200, responds with the a incremented review", () => {
    const reviewUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 2,
        });
      });
  });
  test("PATCH - status:200, responds with the a decremented review", () => {
    const reviewUpdate = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: -99,
        });
      });
  });
  test("PATCH - status:200 responds with the a incremented review ignoring any unnecessary properties", () => {
    const reviewUpdate = { inc_votes: 1, name: "Mitch" };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 2,
        });
      });
  });
  test("PATCH - status:400 sends an appropriate error message when given a invalid data type for inc_vote", () => {
    const reviewUpdate = { inc_votes: "badRequest" };
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request!");
      });
  });
  test("PATCH - status:400 sends an appropriate error message when inc_vote is not present on the request body", () => {
    const reviewUpdate = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(reviewUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing Input Data!");
      });
  });
  test("PATCH - status:404 sends an appropriate error message when given a valid but non-existent id", () => {
    const reviewUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/999")
      .send(reviewUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Resource not found!");
      });
  });
  test("PATCH - status:400 sends an appropriate error message when given a invalid id (wrong data type)", () => {
    const reviewUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/reviews/something-bad")
      .send(reviewUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request!");
      });
  });
});

describe("GET /api/users", () => {
  test("GET - status:200, responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("GET - status:200, responds with a user object with the correct content", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users[0]).toEqual(
          expect.objectContaining({
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
});
