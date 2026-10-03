# Linux runtime dependencies

The standalone executable embeds game resources and GPNext. It still uses the
system WebKitGTK, GTK and GStreamer runtime libraries.

On Arch Linux and CachyOS, install or update the runtime packages:

```sh
sudo pacman -Syu --needed webkit2gtk-4.1 gst-plugins-base gst-plugins-good
```

`GStreamer element autoaudiosink not found` means the audio-output plugin is
missing or cannot be discovered. GStreamer itself does not include every plugin.
On Arch/CachyOS, `gst-plugins-good` supplies the autodetect plugin. Verify it with:

```sh
gst-inspect-1.0 autoaudiosink
```

If that succeeds but launching still fails, include the terminal log, distro,
GPU model, and whether the window closes, stays blank, or opens without sound.
Do not assume every Mesa warning is the cause of a startup failure.

The app leaves GStreamer's plugin search path alone so each distribution can
find its own libraries (including `/usr/lib64` installations). Explicit user
GStreamer environment settings remain respected.

References: [GStreamer plugin search paths](https://gstreamer.freedesktop.org/documentation/gstreamer/running.html)
and [Arch gst-plugins-good](https://archlinux.org/packages/extra/x86_64/gst-plugins-good/).
# Hybrid NVIDIA graphics

Intel rendering can still present through an NVIDIA-driven compositor. Automatic
selection now enables the WebKit DMA-BUF workaround when NVIDIA is present,
including hybrid machines, and leaves EGL vendor discovery to GLVND.

For the existing release, test `GARDENDLESS_DMABUF=0 ./gardendless-linux-x64`.
The launcher build also supports `./gardendless --safe-graphics`, which uses system
GPU selection, disables DMA-BUF and uses X11/XWayland when a display is available.
Add `--game` to open the included game directly. This is a compatibility path,
not a guarantee against all driver problems. `GARDENDLESS_DMABUF=1` explicitly
opts back into DMA-BUF for testing.
