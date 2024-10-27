const sentence_no_space_between = /([a-zA-Z0-9])\.([a-zA-Z0-9])/g;
const alphanumeric = /[a-zA-Z0-9]/g;

/** @type import("markdownlint").Rule */
module.exports = {
  "names": [ "STYLE001", "space-between-sentences" ],
  "description": "After fullstop, we should always have a space before the start of the next sentence",
  "tags": [ "style" ],
  "parser": "markdownit",
  "function": function STYLE001(params, onError)
  {
    const sentence_no_space_betweenRe =
    new RegExp(sentence_no_space_between);

    const inlines = params.parsers.markdownit.tokens
      .filter((token) => token.type === "inline");

    for(const inline of inlines)
    {
      const texts = inline.children.filter((child) => child.type === "text");
      for(const text of texts) //VERY IMPORTANT, to traverse use 'of' instead of 'in'
      {
        if(sentence_no_space_betweenRe.test(text.content))
        {
          lineNumber = text.lineNumber;
          line = text.content;
          const index = line.toLowerCase().indexOf("."); //0-based index
          if (index !== -1) {
            is_prev_alphanumeric = false;
            is_next_alphanumeric = false;
            prev_index = index - 1;
            next_index = index + 1;
            {
              if(prev_index > 0 && prev_index < line.length){
                is_prev_alphanumeric = line[prev_index].match(alphanumeric);
              }
              else{
                prev_index = 1;
              }
            }
            {
              if(next_index > 0 && next_index < line.length){
                is_next_alphanumeric = line[next_index].match(alphanumeric);
              }
              else{
                next_index = line.length;
              }
            }

            if(is_prev_alphanumeric && is_next_alphanumeric)
            {
              // See https://github.com/DavidAnson/markdownlint/blob/main/doc/CustomRules.md
              
              // Error range is in the form of [index, length], so here we use 
              //prev_index to mark the start of the range and then take the 
              //difference with the next_index to find the number of characters 
              //in between. Take note that both index and length have been 
              //incremented to convert from 0-base to 1-base indexing.
              errorRange = [prev_index+1, next_index - prev_index + 1];
              
              onError({
                "lineNumber": lineNumber,
                "detail": "Needs a space in between two sentences",
                "context": line,
                "range": errorRange,
                "fixInfo":{
                  editColumn: next_index+1, //Again +1 for 1-based index
                  deleteCount: 0,
                  insertText: " "
                } // fixInfo
              });
            }
          }
        }
      }
    }
  }
}