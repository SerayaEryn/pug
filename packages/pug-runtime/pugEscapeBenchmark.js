'use strict'

const Benchmark = require('benchmark');

function pug_escape_new(_html){
  var html = '' + _html;
  let regexResult = -1
  const index1 = html.indexOf('"');
  const index2 = html.indexOf('&');
  const index3 = html.indexOf('<');
  const index4 = html.indexOf('>');

  if (index1 > -1) {
    regexResult = index1
  }
  if (index2 > -1 && (index2 < regexResult || regexResult === -1)) {
    regexResult = index2
  }
  if (index3 > -1 && (index3 < regexResult || regexResult === -1)) {
    regexResult = index3
  }
  if (index4 > -1 && (index4 < regexResult || regexResult === -1)) {
    regexResult = index4
  }
  if (regexResult === -1 ) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

var pug_match_html = /["&<>]/;
function pug_escape(_html){
  var html = '' + _html;
  var regexResult = pug_match_html.exec(html);
  if (!regexResult) return _html;

  var result = '';
  var i, lastIndex, escape;
  for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
    switch (html.charCodeAt(i)) {
      case 34: escape = '&quot;'; break;
      case 38: escape = '&amp;'; break;
      case 60: escape = '&lt;'; break;
      case 62: escape = '&gt;'; break;
      default: continue;
    }
    if (lastIndex !== i) result += html.substring(lastIndex, i);
    lastIndex = i + 1;
    result += escape;
  }
  if (lastIndex !== i) return result + html.substring(lastIndex, i);
  else return result;
};

const stringsNothingToEscape = [
  'Lorem',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
]

const stringsCharsToEscapeEnd = [
  'Lorem<>',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam<>',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam<>',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.<>'
]

const stringsCharsToEscapeMiddle = [
  'Lor<em',
  'Lorem ipsum dolor sit amet, conse<tetur sadipscing elitr, sed diam',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy <eirmod tempor invidunt ut labore et dolore magna aliquyam',
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ame<t, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
]

const stringsCharsToEscapeStart = [
  '<Lorem',
  '<Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
  '<Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
  '<Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
]
  
new Benchmark.Suite()
  .add('new - nothing to escape', function() {
    for (const string of stringsNothingToEscape) {
      pug_escape_new(string)
    }
  })
  .add('old - nothing to escape', function() {
    for (const string of stringsNothingToEscape) {
      pug_escape(string)
    }
  })
  .add('new - chars to escape - at end', function() {
    for (const string of stringsCharsToEscapeEnd) {
      pug_escape_new(string)
    }
  })
  .add('old - chars to escape - at end', function() {
    for (const string of stringsCharsToEscapeEnd) {
      pug_escape(string)
    }
  })
  .add('new - chars to escape - at middle', function() {
    for (const string of stringsCharsToEscapeMiddle) {
      pug_escape_new(string)
    }
  })
  .add('old - chars to escape - at middle', function() {
    for (const string of stringsCharsToEscapeMiddle) {
      pug_escape(string)
    }
  })
  .add('new - chars to escape - at start', function() {
    for (const string of stringsCharsToEscapeStart) {
      pug_escape_new(string)
    }
  })
  .add('old - chars to escape - at start', function() {
    for (const string of stringsCharsToEscapeStart) {
      pug_escape(string)
    }
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true })
