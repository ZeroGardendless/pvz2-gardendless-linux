//! Pulse's simple client uses the same server/socket inside and outside Flatpak.
//! The stream belongs exclusively to the mixer thread; no pointer crosses threads.
use std::ffi::{c_char, c_int, c_void, CStr};
#[repr(C)]
struct SampleSpec {
    format: c_int,
    rate: u32,
    channels: u8,
}
#[repr(C)]
struct BufferAttr {
    maxlength: u32,
    tlength: u32,
    prebuf: u32,
    minreq: u32,
    fragsize: u32,
}
#[link(name = "pulse-simple")]
extern "C" {
    fn pa_simple_new(
        server: *const c_char,
        name: *const c_char,
        direction: c_int,
        device: *const c_char,
        stream_name: *const c_char,
        spec: *const SampleSpec,
        map: *const c_void,
        attr: *const BufferAttr,
        error: *mut c_int,
    ) -> *mut c_void;
    fn pa_simple_write(
        stream: *mut c_void,
        data: *const c_void,
        bytes: usize,
        error: *mut c_int,
    ) -> c_int;
    fn pa_simple_free(stream: *mut c_void);
}
#[link(name = "pulse")]
extern "C" {
    fn pa_strerror(error: c_int) -> *const c_char;
}
fn message(error: c_int) -> String {
    unsafe {
        CStr::from_ptr(pa_strerror(error))
            .to_string_lossy()
            .into_owned()
    }
}
pub struct Output(*mut c_void);
impl Output {
    pub fn open() -> Result<Self, String> {
        let spec = SampleSpec {
            format: 5,
            rate: 48000,
            channels: 2,
        }; // PA_SAMPLE_FLOAT32LE
        let attr = BufferAttr {
            maxlength: u32::MAX,
            tlength: 15360,
            prebuf: u32::MAX,
            minreq: 3840,
            fragsize: u32::MAX,
        };
        let mut error = 0;
        let stream = unsafe {
            pa_simple_new(
                std::ptr::null(),
                c"Gardendless".as_ptr(),
                1,
                std::ptr::null(),
                c"Game audio".as_ptr(),
                &spec,
                std::ptr::null(),
                &attr,
                &mut error,
            )
        };
        if stream.is_null() {
            Err(message(error))
        } else {
            Ok(Self(stream))
        }
    }
    pub fn write(&mut self, samples: &[f32]) -> Result<(), String> {
        let mut error = 0;
        if unsafe {
            pa_simple_write(
                self.0,
                samples.as_ptr().cast(),
                std::mem::size_of_val(samples),
                &mut error,
            )
        } < 0
        {
            Err(message(error))
        } else {
            Ok(())
        }
    }
}
impl Drop for Output {
    fn drop(&mut self) {
        unsafe {
            pa_simple_free(self.0);
        }
    }
}
