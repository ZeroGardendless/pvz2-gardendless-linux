#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include <string.h>
#include <gdk/gdkx.h>
#include <X11/extensions/XTest.h>
static int result=1;
static char *root;
static void resource(WebKitURISchemeRequest *request, gpointer unused) {
 const char *uri_path=webkit_uri_scheme_request_get_path(request);
 char *path=g_uri_unescape_string(uri_path,NULL);
 if(!path || strstr(path,"..")){g_free(path);return;}
 const char *relative=g_str_has_prefix(path,"/__checks/")?path+10:path;
 char *file=g_build_filename(root,g_str_has_prefix(path,"/__checks/")||strcmp(path,"/AudioSmoke.html")==0?"scripts/checks":"public",relative,NULL);
 char *contents=NULL;gsize size=0;GError *error=NULL;
 if(!g_file_get_contents(file,&contents,&size,&error)){
  webkit_uri_scheme_request_finish_error(request,error);g_clear_error(&error);
 }else{
  const char *mime=g_str_has_suffix(path,".js")?"text/javascript":g_str_has_suffix(path,".mp3")?"audio/mpeg":"text/html";
  GInputStream *stream=g_memory_input_stream_new_from_data(contents,size,g_free);
  webkit_uri_scheme_request_finish(request,stream,size,mime);g_object_unref(stream);
 }
 g_free(file);g_free(path);
}
static void changed(GObject *object,GParamSpec *spec,gpointer data){
 const char *title=webkit_web_view_get_title(WEBKIT_WEB_VIEW(object));
 if(title&&strcmp(title,"READY")==0){
  gtk_widget_grab_focus(GTK_WIDGET(object));
  GdkWindow *window=gtk_widget_get_window(GTK_WIDGET(object));
  int x=0,y=0;gdk_window_get_origin(window,&x,&y);
  Display *display=gdk_x11_display_get_xdisplay(gdk_display_get_default());
  XTestFakeMotionEvent(display,-1,x+20,y+20,CurrentTime);
  XTestFakeButtonEvent(display,1,True,CurrentTime);
  XTestFakeButtonEvent(display,1,False,CurrentTime);
  XFlush(display);
 }
 if(title&&g_str_has_prefix(title,"RESULT:")){g_print("%s\n",title);result=g_str_has_prefix(title,"RESULT: PASS")?0:1;gtk_main_quit();}
}
static gboolean expire(gpointer data){g_printerr("Audio test timed out\n");gtk_main_quit();return G_SOURCE_REMOVE;}
int main(int argc,char**argv){
 gtk_init(&argc,&argv);root=g_get_current_dir();
 WebKitWebContext *context=webkit_web_context_new_ephemeral();
 webkit_web_context_register_uri_scheme(context,"tauri",resource,NULL,NULL);
 WebKitSecurityManager *security=webkit_web_context_get_security_manager(context);
 webkit_security_manager_register_uri_scheme_as_secure(security,"tauri");
 webkit_security_manager_register_uri_scheme_as_cors_enabled(security,"tauri");
 GtkWidget *view=webkit_web_view_new_with_context(context);
 g_object_set(webkit_web_view_get_settings(WEBKIT_WEB_VIEW(view)),"enable-write-console-messages-to-stdout",TRUE,"media-playback-requires-user-gesture",FALSE,NULL);
 GtkWidget *window=gtk_window_new(GTK_WINDOW_TOPLEVEL);gtk_container_add(GTK_CONTAINER(window),view);
 g_signal_connect(view,"notify::title",G_CALLBACK(changed),NULL);gtk_widget_show_all(window);
 char *uri=g_strdup_printf("tauri://localhost/__checks/%s",argc>1?argv[1]:"AudioSmoke.html");
 webkit_web_view_load_uri(WEBKIT_WEB_VIEW(view),uri);g_free(uri);
 g_timeout_add_seconds(120,expire,NULL);gtk_main();g_free(root);return result;
}
