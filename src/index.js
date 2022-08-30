const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const tableName = 'books';

module.exports.create = async (event, context, callback) => {
  const data = JSON.parse(event.body);

  // validate data
  if (!data.title) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Title is required',
      }),
    });
  }

  if (!data.author) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Author is required',
      }),
    });
  }


  const params = {
    TableName: tableName,
    Item: {
      id: uuid.v4(),
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      publisher: data.publisher,
      genre: data.genre,
      updatedAt: Date.now()
    }
  };

  try {
    await dynamodb.put(params).promise();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    });
  }
  catch (error) {
    callback(new Error(error));
  }
}