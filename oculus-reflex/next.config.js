const withTM = require('next-transpile-modules')(['@patternfly/react-core', '@patternfly/react-styles']);

module.exports = withTM({
    future: {
        webpack5: true
    }
});
