# tmt reproducer
git clone https://github.com/teemtee/tmt testcode
git -C testcode checkout -b testbranch b9960789acccd4d163fa62f5f74409d47c1cb61f
cd testcode
curl -LO https://artifacts.dev.testing-farm.io/8587cad1-aa42-46a8-97fc-21cc612d8edb/workdir-repository-None-8Zvord/tmt-environment-plans-features-advanced.yaml
tmt -c trigger=commit -c arch=x86_64 -c distro=fedora-35 run --all --verbose -e @tmt-environment-plans-features-advanced.yaml provision --how virtual --image Fedora-35 plan --name ^\/plans\/features\/advanced$