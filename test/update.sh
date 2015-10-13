#!/bin/sh

DATA='{ "title": "Point 3 updated", "desc": "Cool point 3", "lat": 0.0, "lng": 0.0 }'
curl -v -H "Content-Type: application/json" -X PUT --data "$DATA" "http://localhost:3000/points/b450d6eb-7c1c-45c8-bbf3-f434cd39cbb5"
echo ""
