// AI Generated custom ESLint rules.
module.exports = {
  'require-try-catch-in-services': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Enforce try-catch blocks in exported async functions within service files.',
        category: 'Best Practices',
      },
      messages: {
        missingTryCatch:
          'All exported API functions in service files must be wrapped in a try-catch block for proper error handling.',
        missingStatusCheck:
          'API functions must check `response.status` (or destructure `status`) after the API call.',
      },
    },
    create(context) {
      return {
        // 1. Targets: export const myFunction = async () => {}
        'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression':
          function (node) {
            if (node.async) checkFunctionBody(context, node);
          },
        // 1b. Targets: export const myFunction = async function() {}
        'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > FunctionExpression':
          function (node) {
            if (node.async) checkFunctionBody(context, node);
          },
        // 2. Targets: export function myFunction() {}
        'ExportNamedDeclaration > FunctionDeclaration': function (node) {
          if (node.async) checkFunctionBody(context, node);
        },
        // 3. Targets: export const myService = { myMethod: async () => {} }
        'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ObjectExpression > Property > ArrowFunctionExpression':
          function (node) {
            if (node.async) checkFunctionBody(context, node);
          },
        // 4. Targets: export const myService = { async myMethod() {} } or { myMethod: async function() {} }
        'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ObjectExpression > Property > FunctionExpression':
          function (node) {
            if (node.async) checkFunctionBody(context, node);
          },
      };
    },
  },
  'no-inline-api-in-react-query': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Prevent inline API calls directly inside useQuery/useMutation queryFn or mutationFn.',
        category: 'Best Practices',
      },
      messages: {
        inlineApiCall:
          'API calls should not be made directly inside useQuery/useMutation. Abstract the API logic into a separate async service function to ensure proper try/catch and status code handling.',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type === 'Identifier' &&
            (node.callee.name === 'useQuery' || node.callee.name === 'useMutation')
          ) {
            const configObject = node.arguments[0];
            if (configObject && configObject.type === 'ObjectExpression') {
              const targetProperties = configObject.properties.filter(
                (prop) =>
                  prop.type === 'Property' &&
                  prop.key &&
                  prop.key.type === 'Identifier' &&
                  (prop.key.name === 'queryFn' || prop.key.name === 'mutationFn'),
              );

              targetProperties.forEach((prop) => {
                let hasInlineApi = false;
                const visited = new Set();

                function searchForApi(astNode) {
                  if (!astNode || typeof astNode !== 'object' || hasInlineApi) return;
                  if (visited.has(astNode)) return;
                  visited.add(astNode);

                  // Detect `api.get(...)`
                  if (
                    astNode.type === 'CallExpression' &&
                    astNode.callee.type === 'MemberExpression' &&
                    astNode.callee.object.type === 'Identifier' &&
                    astNode.callee.object.name === 'api' &&
                    ['get', 'post', 'put', 'patch', 'delete'].includes(astNode.callee.property.name)
                  ) {
                    hasInlineApi = true;
                  }

                  for (const key in astNode) {
                    if (key === 'parent' || key === 'tokens' || key === 'comments') continue;

                    if (Array.isArray(astNode[key])) {
                      astNode[key].forEach(searchForApi);
                    } else if (typeof astNode[key] === 'object') {
                      searchForApi(astNode[key]);
                    }
                  }
                }

                // If value is not a simple identifier referencing another function, we check it
                if (prop.value.type !== 'Identifier') {
                  searchForApi(prop.value);
                }

                if (hasInlineApi) {
                  context.report({
                    node: prop,
                    messageId: 'inlineApiCall',
                  });
                }
              });
            }
          }
        },
      };
    },
  },
  'prefer-flatlist-over-map': {
    meta: {
      type: 'suggestion',
      docs: { description: 'Prefer FlatList over Array.map for rendering lists in React Native.' },
      messages: {
        preferFlatList:
          'Avoid using Array.map to render lists of components. Use FlatList instead for better performance on long lists.',
      },
    },
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'MemberExpression' && node.callee.property.name === 'map') {
            const arg = node.arguments[0];
            if (
              arg &&
              (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression')
            ) {
              if (arg.body.type === 'JSXElement' || arg.body.type === 'JSXFragment') {
                context.report({ node, messageId: 'preferFlatList' });
              }
            }
          }
        },
      };
    },
  },
};

function checkFunctionBody(context, node) {
  const body = node.body;

  // If the arrow function has a block body { ... }
  if (body.type === 'BlockStatement') {
    // Look for a TryStatement inside the block
    const tryStatement = body.body.find((statement) => statement.type === 'TryStatement');

    if (!tryStatement) {
      context.report({
        node,
        messageId: 'missingTryCatch',
      });
      return;
    }

    let hasStatusCheck = false;
    const visited = new Set();

    // Check inside the try-catch block for response.status or { status }
    function searchForStatusCheck(astNode) {
      if (!astNode || typeof astNode !== 'object' || hasStatusCheck) return;
      if (visited.has(astNode)) return;
      visited.add(astNode);

      // Look for member expressions targeting 'status' like response.status
      if (
        astNode.type === 'MemberExpression' &&
        astNode.property &&
        astNode.property.name === 'status'
      ) {
        hasStatusCheck = true;
      }

      // Look for destructured variables named 'status'
      if (astNode.type === 'Property' && astNode.key && astNode.key.name === 'status') {
        hasStatusCheck = true;
      }

      for (const key in astNode) {
        // Skip parent references which cause circular traversal
        if (key === 'parent' || key === 'tokens' || key === 'comments') continue;

        if (Array.isArray(astNode[key])) {
          astNode[key].forEach(searchForStatusCheck);
        } else if (typeof astNode[key] === 'object') {
          searchForStatusCheck(astNode[key]);
        }
      }
    }

    searchForStatusCheck(tryStatement.block);

    if (!hasStatusCheck) {
      context.report({
        node,
        messageId: 'missingStatusCheck',
      });
    }
  } else {
    // If it's an implicit return arrow function like: const fetch = async () => api.get()
    // That also means there is no try-catch
    context.report({
      node,
      messageId: 'missingTryCatch',
    });
  }
}
