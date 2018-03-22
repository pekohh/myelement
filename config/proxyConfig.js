module.exports = {
  proxyList: {
    '/shopping': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/v1': '/v1'
      }
    },
    '/v1': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/v1': '/v1'
      }
    },
    '/v2': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
      	'^/v2': '/v2'
      }
    },
    '/v4': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/v4': '/v4'
      }
    },
    '/shop': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/shop': '/shop'
      }
    },
    '/ugc': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/ugc': '/ugc'
      }
    },
    '/v3': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/v3': '/v3'
      }
    },
    '/eus': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/eus': '/eus'
      }
    },
    '/payapi': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/payapi': '/payapi'
      }
    },
    '/bos': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/bos': '/bos'
      }
    },
    '/member': {
      target: 'http://cangdu.org:8001',
      changeOrigin: true,
      pathRewrite: {
        '^/member': '/member'
      }
    }
  }
}
