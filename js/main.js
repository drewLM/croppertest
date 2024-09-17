// $(function () {

    const $image = $('#image');
    const $imageCropped = $('#img-cropped');
    const $uploadBtn = $('#upload-btn');
    const $cropBtn =  $('#crop-btn');

    let width = 1;
    let height = 1;

    $image.cropper.setDefaults({
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: width/height,
    autoCropArea: 1,
    restore: false,
    center: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    zoomable: false,
    background:false,
    guides: false,
    center: false,
});

    cropperInit();

    function cropperInit() {
        $image.cropper({
        crop: function(event) {
                canvas = $image.cropper("getCroppedCanvas", {
                    fillColor: fillColor,
                    maxWidth: 1100
                });        
            }
        });
    }

    function cropperDestory() {
        $image.cropper("destroy"); 
    }

    $cropBtn.click(function(e){
        $("#img-cropped").empty();
        $imageCropped.append(canvas);
    });

    $uploadBtn.click(function(e) {
        const base64 = canvas.toDataURL();
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0,0,imageWidth, imageHeight);
        const buffer = imageData.data.buffer;  
        // console.log("uploading...");
        // console.log({canvasData, buffer, imageData});
         // sending both base64 and buffer we can only send one type
        sendData({buffer, base64});
    });


    function sendData(data) {
        let msg = {
            "isCropper" : true,
        }
        msg = {...msg, ...data};
        console.log("message : " , msg);
        window.parent.postMessage(msg, "*");
    }

    function updateCropperImage(url) {
        $image.attr("src" , url);
        refreshCropper();
    }

    function refreshCropper() {
        cropperDestory();
        cropperInit();
    }

    window.onmessage = e => {
        let {data} = e;
        if(data.toUpdateImageURL) {
            let url = data.updateImageURL;
            updateCropperImage(url);
            width = data.widthupload;
            height = data.heightupload
        
        }
    }

    sendData({ready: true});
// });
