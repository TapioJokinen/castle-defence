import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: false,
    port: 3000,
    static: ['./'],
  },
});
