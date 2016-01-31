var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: {
      lastName: { type: String, required: true },
      firstName: String
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image_url: String
});

mongoose.model('Book', BookSchema);