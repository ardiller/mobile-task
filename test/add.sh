#!/bin/sh

DATA='{ "title": "Point 1", "desc": "Cool point", "lat": 0.0, "lng": 0.0 }'
curl -v -H "Content-Type: application/json" -X POST --data "$DATA" http://localhost:3000/points
echo ""
