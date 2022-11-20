const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

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
        expect(reviews).toHaveLength(10);
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
              comment_count: expect.any(Number),
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
        expect(reviews).toBeSortedBy("title", { descending: true });
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
  test("GET - status:200, defaults to returning 10 responses when not passed a limit", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(10);
      });
  });
  test("GET - status:200, returns stated number of responses if limit is passed", () => {
    return request(app)
      .get("/api/reviews?limit=8")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(8);
      });
  });
  test("GET - status:400, returns an error message when passed an invalid limit", () => {
    return request(app)
      .get("/api/reviews?limit=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Limit Query!");
      });
  });
  test("GET - status:200, returns selected page of results if passed page value", () => {
    return request(app)
      .get("/api/reviews?p=2")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews.length).toBe(3);
      });
  });
  test("GET - status:400, returns an error message when passed an invalid page value", () => {
    return request(app)
      .get("/api/reviews?p=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Page Query!");
      });
  });
  test("GET - status:200, returns a total_count property as a separate object", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { total_count } = body;
        expect(total_count).toBe(13);
      });
  });
  test("GET - status:200, returns accurate total_count property when a filter is applied", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        const { total_count } = body;
        expect(total_count).toBe(11);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
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
          comment_count: 0,
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

describe("GET /api/reviews/:review_id/comments", () => {
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
  test("GET - status:200, defaults to returning 10 responses when not passed a limit", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(3);
      });
  });
  test("GET - status:200, returns stated number of responses if limit is passed", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=2")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(2);
      });
  });
  test("GET - status:400, returns an error message when passed an invalid limit ", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Limit Query!");
      });
  });
  test("GET - status:200, returns selected page of results if passed page value", () => {
    return request(app)
      .get("/api/reviews/2/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });
  test("GET - status:400, returns an error message when passed an invalid page value", () => {
    return request(app)
      .get("/api/reviews/2/comments?p=something bad")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Page Query!");
      });
  });
  test("GET - status:200, returns a total_count property as a separate object", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { total_count } = body;
        expect(total_count).toBe(3);
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

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE - status:204, deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE - status:404 responds with an appropriate error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment Does Not Exist!");
      });
  });
});

describe("GET /api", () => {
  test("GET - status:200, responds with a JSON file of all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /users/:username", () => {
  test("GET - status:200, responds with a user object", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeInstanceOf(Object);
        expect.objectContaining({
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET - status:404 sends an appropriate error message when given a non-existent username", () => {
    return request(app)
      .get("/api/users/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found!");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH - status:200, responds with the a incremented comment", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 17,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH - status:200, responds with the a decremented comment", () => {
    const commentUpdate = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 15,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH - status:200 responds with the a incremented comment ignoring any unnecessary properties", () => {
    const commentUpdate = { inc_votes: 1, name: "Mitch" };
    return request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 17,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH - status:400 sends an appropriate error message when given a invalid data type for inc_vote", () => {
    const commentUpdate = { inc_votes: "badRequest" };
    return request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request!");
      });
  });
  test("PATCH - status:400 sends an appropriate error message when inc_vote is not present on the request body", () => {
    const commentUpdate = {};
    return request(app)
      .patch("/api/comments/1")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Missing Input Data!");
      });
  });
  test("PATCH - status:404 sends an appropriate error message when given a valid but non-existent id", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/999")
      .send(commentUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Resource not found!");
      });
  });
  test("PATCH - status:400 sends an appropriate error message when given a invalid id (wrong data type)", () => {
    const commentUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/something-bad")
      .send(commentUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request!");
      });
  });
});

describe("POST /api/reviews", () => {
  test("POST - status:201, inserts a new review into the database and responds with newly added review", () => {
    const newReview = {
      owner: "dav3rid",
      title: "risk",
      review_body: "A game of strategy and domination",
      designer: "Albert Lamorisse",
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          comment_count: "0",
          ...newReview,
        });
      });
  });
  test("POST - status:201, inserts a new Review into the database and responds with newly added review ignoring unnecessary properties", () => {
    const newReview = {
      owner: "dav3rid",
      title: "risk",
      review_body: "A game of strategy and domination",
      designer: "Albert Lamorisse",
      category: "euro game",
      unnecessary_key: "unnecessary information",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 14,
          votes: 0,
          created_at: expect.any(String),
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          comment_count: "0",
          owner: "dav3rid",
          title: "risk",
          review_body: "A game of strategy and domination",
          designer: "Albert Lamorisse",
          category: "euro game",
        });
      });
  });
  test("POST - status:400, responds with an appropriate error message when provided with a bad review (eg no title)", () => {
    const newReview = {
      owner: "dav3rid",
      review_body: "A game of strategy and domination",
      designer: "Albert Lamorisse",
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Missing Input Data!");
      });
  });
  test("POST - status:404 sends an appropriate error message when given an non-existent owner", () => {
    const newReview = {
      owner: "Kev",
      title: "risk",
      review_body: "A game of strategy and domination",
      designer: "Albert Lamorisse",
      category: "euro game",
    };
    return request(app)
      .post("/api/reviews")
      .send(newReview)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Resource not found!");
      });
  });
});

describe("POST /api/categories", () => {
  test("POST - status:201, inserts a new category into the database and responds with newly added category", () => {
    const newCategory = {
      slug: "displace",
      description: "games of displacement",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(201)
      .then(({ body }) => {
        expect(body.category).toEqual({
          ...newCategory,
        });
      });
  });
  test("POST - status:201, inserts a new category into the database and responds with newly added category ignoring unnecessary properties", () => {
    const newCategory = {
      slug: "displace",
      description: "games of displacement",
      unnecessary_key: "unnecessary information",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(201)
      .then(({ body }) => {
        expect(body.category).toEqual({
          slug: "displace",
          description: "games of displacement",
        });
      });
  });
  test("POST - status:400, responds with an appropriate error message when provided with a bad category (eg no slug)", () => {
    const newCategory = {
      description: "games of displacement",
      unnecessary_key: "unnecessary information",
    };
    return request(app)
      .post("/api/categories")
      .send(newCategory)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Missing Input Data!");
      });
  });
});
