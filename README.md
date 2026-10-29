# 深鲸能力清单（@deepwhale-cn/dsh-capability-audit）

静态扫描代码，列出项目实际用到的能力：执行命令、网络请求、写文件、读凭据、读用户目录、常驻进程。

## 安装

```bash
dsh plugin --profile web add @deepwhale-cn/dsh-capability-audit
```

## 用法

```bash
dsh-capability-audit --input ./plugins/xxx
```

面板：侧栏「深鲸能力清单」。不联网、不执行目标代码。
