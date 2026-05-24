# tmt reproducer
git clone https://github.com/martinpitt/python-dbusmock testcode
git -C testcode checkout -b testbranch 33cc0bbbb411b31a4177e33b9f16c341e49fe803
cd testcode
tmt run --all --verbose provision --how virtual --image Fedora-37 plan --name ^\/plans\/all$