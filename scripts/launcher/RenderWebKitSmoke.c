#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
static int result=1;
static void changed(GObject *object,GParamSpec *spec,gpointer data){
 const char *title=webkit_web_view_get_title(WEBKIT_WEB_VIEW(object));
 if(title && g_str_has_prefix(title,"RESULT:")){g_print("%s\n",title);result=g_str_has_prefix(title,"RESULT: PASS")?0:1;gtk_main_quit();}
}
static gboolean expire(gpointer data){g_printerr("Timed out\n");gtk_main_quit();return G_SOURCE_REMOVE;}
int main(int argc,char**argv){gtk_init(&argc,&argv);
 WebKitWebContext *context=webkit_web_context_new_ephemeral();GtkWidget *view=webkit_web_view_new_with_context(context);
 g_object_set(webkit_web_view_get_settings(WEBKIT_WEB_VIEW(view)), "enable-write-console-messages-to-stdout", TRUE, NULL);
 GtkWidget *window=gtk_window_new(GTK_WINDOW_TOPLEVEL);gtk_window_set_default_size(GTK_WINDOW(window),2560,1200);
 gtk_container_add(GTK_CONTAINER(window),view);g_signal_connect(view,"notify::title",G_CALLBACK(changed),NULL);
 gtk_widget_show_all(window);webkit_web_view_load_uri(WEBKIT_WEB_VIEW(view),argv[1]);g_timeout_add_seconds(argc>2?atoi(argv[2]):600,expire,NULL);gtk_main();return result;}
