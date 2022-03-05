
#!/bin/sh
yarn build

# upload s3
aws s3 sync ./build s3://aim-front

# invalidation cloudfront
aws cloudfront create-invalidation --distribution-id E3140M2D0LJL62 --path '/*'
