var mongoose = require('mongoose');

var statuses = 'pending accepted rejected'.split(' ');

var TradeSchema = new mongoose.Schema({
  bookRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  bookOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: statuses, default: 'pending' }
});

TradeSchema.methods.accept = function(){
  this.status = 'accepted';
}

TradeSchema.methods.reject = function(){
  this.status = 'rejected';
}

mongoose.model('Trade', TradeSchema);