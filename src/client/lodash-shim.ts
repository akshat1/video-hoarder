/*
Didn't see a working solution to tree-shake lodash other than the lodash babel
plugin, and we can't use _that_ because we don't use babel.

So as a workaround, we have this file. And we use the module replacement plugin
in webpack to replace "lodash" with this file.

This works, and results in about 0.7M difference in raw bundle size.
*/
import camelCase from "lodash/camelCase";
import capitalize from "lodash/capitalize";
import debounce from "lodash/debounce";
import get from "lodash/get";
import memoize from "lodash/memoize";
import pick from "lodash/pick";
import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";

const _ = {
  camelCase,
  capitalize,
  debounce,
  get,
  memoize,
  pick,
  reverse,
  sortBy,
};

// eslint-disable-next-line import/no-default-export
export default _;
