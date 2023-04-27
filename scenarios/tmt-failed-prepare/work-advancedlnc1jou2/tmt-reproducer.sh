# tmt reproducer
git clone --recurse-submodules https://github.com/teemtee/tmt testcode
git -C testcode checkout -b testbranch 135c5685e8210234e623b6a03a7436083f830d7b
cd testcode
curl -o guest-setup-0.sh -L https://artifacts.dev.testing-farm.io/49461c76-bf72-4d80-ab69-516e7536452e/guest-setup-0e4018be-2966-45c1-b4ca-44c6747a02e1/artifact-installation-0e4018be-2966-45c1-b4ca-44c6747a02e1/sut_install_commands.sh
curl -LO https://artifacts.dev.testing-farm.io/49461c76-bf72-4d80-ab69-516e7536452e/git-135c5685e8210234e623b6a03a7436083f830d7bocpvm8_9/tmt-environment-plans-features-advanced.yaml
tmt -c arch=x86_64 -c distro=centos-stream-8 -c trigger=commit run --until provision --verbose -e @tmt-environment-plans-features-advanced.yaml provision --how virtual --image CentOS-Stream-8 plan --name ^/plans/features/advanced$
tmt run --last login < guest-setup-0.sh
tmt run --last --since prepare