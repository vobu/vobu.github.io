---
layout: post
title: "MacBook Pro German keyboard layout on openSUSE (tumbleweed)"
date: 2021-03-03 16:00:00 +0100
categories: macbook opensuse
tags: macbook opensuse
---

(Still) a big linux/SUSE fan, so running it on my mac(s) ever since. For evaluating options to move away from VMWare, just recently gave [UTM](https://mac.getutm.app) a test-drive, which is a [QEMU](https://www.qemu.org)-variant specifically enhanced for macOS.  

Smooth process overall, only caveat for Tumbleweed was to set the specific CPU architecture in `UTM`, otherwise it wouldn't install:
![setting CPU specifically in UTM](/img/UTM-opensuse-cpu-setting.png)

But after the successful install, sure enough, the old keyboard setting nemesis awoke: wasn't able to type `@`, `~`, `[`, `]`, `|`, `{`, `}` and `\` on my German MacBook Pro keyboard, because Tumbleweed didn't recognize the proper keycodes.  

So mostly as note to myself, here are the proper settings for having openSUSE recognize the macOS keycodes from the a German MacBook Pro:

1. keyboard hardware: `Apple | MacBook/MacBook Pro (intl.)`
  ![german macbook pro keyboard hardware setting: apple - macbook/macbook pro (intl.)](/img/opensuse-on-macbook-hw-keyboard.png)
2. keyboard layout: `German`, Variant: `Default` (_not_ `German (MacIntosh)`)
  ![german macbook pro keyboard layout: german, no special setting](/img/opensuse-on-macbook-keyboard-layout.png)
3. `Advanced`: most important setting: `Key to choose the 3rd level` &rarr; `Left Alt`
  ![german macbook pro keyboard advanced setting: left alt as key to choose the 3rd level](/img/opensuse-on-macbook-keyboard-advanced.png)
