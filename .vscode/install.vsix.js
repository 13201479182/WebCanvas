import { exec } from 'child_process';

const plugins = [
    'formulahendry.auto-close-tag',
    'formulahendry.auto-rename-tag',
    'alefragnani.project-manager',
    'circledev.glsl-canvas',
    'dbaeumer.vscode-eslint',
    'ecmel.vscode-html-css',
    'esbenp.prettier-vscode',
    'MS-CEINTL.vscode-language-pack-zh-hans',
    'PKief.material-icon-theme',
    'slevesque.shader',
    'Vue.volar',
    'Vue.vscode-typescript-vue-plugin',
    'wejectchan.vue3-snippets-for-vscode',
    'yandeu.five-server',
    'eamodio.gitlens',
    'Gruntfuggly.todo-tree',
];

function installPlugins(installedPlugins) {
    for (const plugin of plugins) {
        if (installedPlugins.indexOf(plugin) === -1) {
            const child = exec(`code --install-extension ${plugin}`, (err, stdout, stderr) => {
                const pluginName = plugin.split('.')[1];
                if (err) {
                    console.log(`vsix: ${pluginNamea} 安装失败, 请使用 npm i 重试!`);
                }
                console.log(`vsix: ${pluginName} 安装成功!`);
                // 结束子进程
                child.kill();
            });
        }
    }
}

exec('code --list-extensions', (err, stdout, stderr) => {
    if (err || stderr) {
        return console.log(err, stderr);
    }
    const installedPlugins = stdout.split('\n').filter(item => item);
    installPlugins(installedPlugins);
});
