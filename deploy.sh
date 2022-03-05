
#!/bin/sh
yarn build

# upload s3
aws s3 sync ./build s3://aim-front

# invalidation cloudfront
aws cloudfront create-invalidation --distribution-id ELBRB7MUDYQ7O --path '/*'
