git hooks
=========
Some notes on howto add git hooks in order to
a) push code to your personal production server whenever you do a commit
b) deploy the baby-monitor server app on the production server each time the server receives a push

Server
======

Add git user + make passwordless sudoer
---------------------------------------
```
sudo adduser git
sudo usermod -aG sudo git
su git
cd ~/
mkdir .ssh && chmod 700 .ssh
touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
```
- **Add your loca id_rsa.pub to authorized_keys for passwordless ssh!**
- Make git sudo passwordless
```
sudo visudo
git ALL=(ALL) NOPASSWD:ALL
```
Make the target working dir
---------------------------
```
sudo mkdir -p /opt/baby-monitor
sudo chown -R git.git /opt/baby-monitor
```

Create the git server repo
--------------------------
```
su git
mkdir /home/git/baby-monitor.git
cd /home/git/baby-monitor.git
git init --bare .
touch hooks/post-receive
chmod +x hooks/post-receive
```

Create the git hook for deploying upon push
-------------------------------------------
- /home/git/baby-monitor.git/hooks/post-receive:
```
#!/bin/bash                                                                                                                        
TARGET="/opt/baby-monitor"
GIT_DIR="/home/git/baby-monitor.git"
BRANCH="master"

while read oldrev newrev ref
do
        # only checking out the master (or whatever branch you would like to deploy)                                               
        if [ "$ref" = "refs/heads/$BRANCH" ];
        then
                echo "Ref $ref received. Deploying ${BRANCH} branch to production..."
                git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH

                # Building the website                                                                                             
                echo "Building the website"
                cd $TARGET/server/webroot-react
                npm run build

                echo "Restarting websocket-proxy"
                sudo systemctl restart websocket-proxy
        else
                echo "Ref $ref received. Doing nothing: only the ${BRANCH} branch may be deployed on this server."
        fi
done
```

Local Linux dev env
===================

- Add the new remote production repo
```
git remote add production ssh://git@yourserver.com:port/home/git/baby-monitor.git
```

- Create post commit hook
```
touch .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```
- .git/hooks/post-commit:
```
#!/bin/sh                                                                                          
git push production master                                                                         
git push origin master
```
