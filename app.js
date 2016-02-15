'use strict';

const bodyParser = require('body-parser')
const express = require('express');
const levelup = require('levelup');
const uuid = require('uuid');

const app = express();
const db = levelup('./points.db');

app.get('/points', function(req, res, next) {
  const result = [];
  let done = false;

  db
    .createReadStream({
      gte: 'points:',
      lte: 'points:\xFF'
    })
    .on('data', function (data) {
      let obj;

      try {
        obj = JSON.parse(data.value);
      } catch (e) {
        onError(e);
        return;
      }

      onNext(obj)
    })
    .on('error', onError)
    .on('close', onEnd)
    .on('end', onEnd);

  function onError(err) {
    done = true;
    next(err);
  }

  function onNext(obj) {
    result.push(obj);
  }

  function onEnd() {
    if (!done) {
      done = true;
      res.send(result);
    }
  }
});

app.get('/points/:point_id', function(req, res, next) {
  db.get('points:' + req.params['point_id'], function (err, value) {
    if (err) {
      if (err.type === 'NotFoundError') {
        res.sendStatus(404);
      } else {
        next(err);
      }
      return;
    }

    let obj;

    try {
      obj = JSON.parse(value);
    } catch (e) {
      next(e);
      return;
    }

    res.send(obj);
  })
});


function normalizeRecord(record) {
  if (!record) {
    return null;
  }

  if (typeof record.title !== 'string' || record.title.length === 0) {
    return null;
  }

  const title = record.title;

  if (record.desc && typeof record.desc !== 'string') {
    return null;
  }

  const desc = record.desc || '';
  const lat = Number(record.lat);
  const lng = Number(record.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return {
    title,
    desc,
    lat,
    lng
  };
}

app.post('/points', bodyParser.json(), function(req, res) {
  const record = normalizeRecord(req.body);

  if (!record) {
    res.sendStatus(400);
    return;
  }

  const id = uuid.v4();
  record.id = id;

  db.put(`points:${id}`, JSON.stringify(record), function(err) {
    if (err) {
      next(err);
      return;
    }
    res.send(record);
  });
});

app.put('/points/:point_id', bodyParser.json(), function(req, res, next) {
  db.get('points:' + req.params['point_id'], function (err, value) {
    if (err) {
      if (err.type === 'NotFoundError') {
        res.sendStatus(404);
      } else {
        next(err);
      }
      return;
    }

    let obj;

    try {
      obj = JSON.parse(value);
    } catch (e) {
      next(e);
      return;
    }

    const record = normalizeRecord(req.body);

    if (!record) {
      res.sendStatus(400);
      return;
    }

    const id = obj.id;
    record.id = id;

    db.put(`points:${id}`, JSON.stringify(record), function(err) {
      if (err) {
        next(err);
        return;
      }
      res.send(record);
    });
  });
});

app.delete('/points/:point_id', function(req, res) {
  db.get('points:' + req.params['point_id'], function (err, value) {
    if (err) {
      if (err.type === 'NotFoundError') {
        res.sendStatus(404);
      } else {
        next(err);
      }
      return;
    }

    let obj;

    try {
      obj = JSON.parse(value);
    } catch (e) {
      next(e);
      return;
    }

    db.del('points:' + req.params['point_id'], function (err) {
      if (err) {
        next(err);
        return;
      }

      res.send(obj);
    });
  });
});

app.listen(3000, function(err) {
  if (err) {
    throw err;
  }

  console.log('Listening on port 3000');
});
