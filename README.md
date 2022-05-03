# Files viewer for nextcloud

Show your latest holiday photos and videos like in the movies. Show a glimpse of your latest novel directly from your nextcloud. Choose the best GIF of your collection thanks to the direct view of your favorites files!

![viewer](https://raw.githubusercontent.com/nextcloud/screenshots/master/apps/Viewer/viewer.png)

## 📋 Current support
- Images
- Videos

## 🏗 Development setup
1. ☁ Clone this app into the `apps` folder of your Nextcloud: `git clone https://github.com/nextcloud/viewer.git`
2. 👩‍💻 In the folder of the app, run the command `make` to install dependencies and build the Javascript.
3. ✅ Enable the app through the app management of your Nextcloud
4. 🎉 Partytime!

### 🧙 Advanced development stuff
To build the Javascript whenever you make changes, instead of the full `make` you can also run `make build-js`.

## API

### Add the viewer to your app
In php, on your page, emit the LoadViewer event.
Check the documentation/tutorial for more info on this type of page controller sample.
``` php
use OCA\Viewer\Event\LoadViewer;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\IRequest;

class PageController extends Controller {
	protected $appName;

	/** @var IEventDispatcher */
	private $eventDispatcher;

	public function __construct($appName,
								IRequest $request,
								IEventDispatcher $eventDispatcher) {
		parent::__construct($appName, $request);

		$this->appName = $appName;
		$this->eventDispatcher = $eventDispatcher;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 * Render default index template
	 *
	 * @return TemplateResponse
	 */
	public function index(): TemplateResponse {
		$this->eventDispatcher->dispatch(LoadViewer::class, new LoadViewer());
		$response = new TemplateResponse($this->appName, 'main');
		return $response;
	}
}
```
This will load all the necessary scripts and make the Viewer accessible trough javascript at `OCA.Viewer`

### Open a file
1. Open a file and let the viewer fetch the folder data
  ```js
  OCA.Viewer.open({path: '/path/to/file.jpg'})
  ```
2. Open a file and profide a list of files
  ```js
  OCA.Viewer.open({
		path: '/path/to/file.jpg',
		list: [
			{
				basename: 'file.jpg',
				filename: '/path/to/file.jpg',
				...
			},
			...
		],
  })
  ```
  The list parameter requires an array of fileinfo. You can check how we generate a fileinfo object [here](https://github.com/nextcloud/viewer/blob/master/src/utils/fileUtils.js#L97) from a dav PROPFIND request data. There is currently no dedicated package for it, but this is coming. You can check the [photos](https://github.com/nextcloud/photos) repository where we also uses it.

In order to open a shared file you will need to provide the share token
so the Viewer can use it to authenticate the requests to the server.
See the `files_sharing` app
[controller](https://github.com/nextcloud/server/blob/master/apps/files_sharing/lib/Controller/ShareController.php#L404)
and
[template](https://github.com/nextcloud/server/blob/master/apps/files_sharing/templates/public.php#L18)
for an example.

### Close the viewer
```js
OCA.Viewer.close()
```

### 🔍 Add you own file view
If you want to make your app compatible with this app, you can use the `OCA.Viewer` methods
1. Create a vue component which use the `path` and `mime` props (they will be automatically passed by the viewer)
2. Register your mime viewer with the following:
   ``` js
    import VideoView from 'VideoView.vue'

    OCA.Viewer.registerHandler({
        // unique id
        id: 'video',

       // optional, it will group every view of this group and
       // use the proper view when building the file list
       // of the slideshow.
       // e.g. you open an image/jpeg that have the `media` group
       // you will be able to see the video/mpeg from the `video` handler
       // files that also have the `media` group set.
       group: 'media',

       // the list of mimes your component is able to display
       mimes: [
            'video/mpeg',
            'video/ogg',
            'video/webm',
            'video/mp4'
        ],

        // your vue component view
        component: VideoView
    })
   ```
3. if you feel like your mime should be integrated on this repo, you can also create a pull request with your object on the `models` directory and the view on the `components` directory. Please have a look at what's already here and take example of it. 🙇‍♀️
