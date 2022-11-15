\c nc_games_test

SELECT 
  title,
  category, 
  designer,
  owner, 
  review_body, 
  review_img_url, 
  reviews.created_at, 
  reviews.votes,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments 
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;