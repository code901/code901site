module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/home/ubuntu/deployments/code901site',
      repositoryUrl: 'https://github.com/code901/code901site.git',
      branch: 'master',
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 3,
      key: '/Users/sean/.ssh/id_rsa'
      //shallowClone: true
    },
    production: {
      servers: 'ubuntu@ec2-52-4-254-61.compute-1.amazonaws.com'
    }
  });

  shipit.task('npm-install', function(){
    return shipit.remote('cd ' + shipit.releasePath + ' && npm install').then(function(res){
      shipit.emit('npm-install-complete');
      return res;
    });
  });

  shipit.task('pm2-restart', function(){
    return shipit.remote('cd ' + shipit.releasePath + ' && pm2 delete process.json && pm2 start process.json --env production').then(function(res){
      shipit.emit('pm2-restart-complete');
      return res;
    });
  });

  shipit.on('deployed', function(){
    shipit.start('npm-install');
  });

  shipit.on('npm-install-complete', function(){
    shipit.start('pm2-restart');
  });
};
