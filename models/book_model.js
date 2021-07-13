var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    comments:  Array,
    commentcount : Number,
});

BookSchema.pre('validate', function (next) {
  this.commentcount = this.comments.length
  next();
});
module.exports = mongoose.model('book', BookSchema);     