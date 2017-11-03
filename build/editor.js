'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crdt = require('./crdt');

var _crdt2 = _interopRequireDefault(_crdt);

var _simplemde = require('simplemde');

var _simplemde2 = _interopRequireDefault(_simplemde);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
  function Editor(controller) {
    var initialText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

    _classCallCheck(this, Editor);

    this.controller = controller;
    this.mde = new _simplemde2.default({
      placeholder: 'Type here...',
      spellChecker: false,
      toolbar: false,
      initialValue: initialText
    });
  }

  _createClass(Editor, [{
    key: 'bindChangeEvent',
    value: function bindChangeEvent() {
      var _this = this;

      this.mde.codemirror.on("change", function (_, changeObj) {
        var idx = _this.findLinearIdx(changeObj.from.line, changeObj.from.ch);

        if (changeObj.origin === "+input") {
          var char = changeObj.text.length > 1 ? '\n' : changeObj.text;
          _this.controller.handleInsert(char, idx);
        } else if (changeObj.origin === "+delete") {
          _this.controller.handleDelete(idx);
        }
      });
    }
  }, {
    key: 'updateView',
    value: function updateView(newText) {
      var cursor = this.mde.codemirror.getCursor();
      this.mde.value(newText);
      this.mde.codemirror.setCursor(cursor);
    }
  }, {
    key: 'findLinearIdx',
    value: function findLinearIdx(lineIdx, chIdx) {
      var linesOfText = this.mde.codemirror.getValue().split("\n");
      var index = 0;
      for (var i = 0; i < lineIdx; i++) {
        index += linesOfText[i].length;
      }

      return index + chIdx;
    }
  }]);

  return Editor;
}();

exports.default = Editor;