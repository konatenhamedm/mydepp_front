<script>
    import { createEventDispatcher } from "svelte";
    export let imageUrl = "https://24ai.tech/fr/wp-content/uploads/sites/19/2023/10/01_product_1_sdelat-kvadratnym-5-scaled.jpg";

    let imagePreviewStyle = `background-image: url(${imageUrl})`;
    const dispatch = createEventDispatcher(); // Initialisation de l'event dispatcher

    function readURL(event) {
        const input = event.target;
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Prévisualisation de l'image
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewStyle = `background-image: url(${e.target.result})`;
            };
            reader.readAsDataURL(file);

            // Émission de l'événement avec le fichier
            dispatch("file-selected", file); // Envoi du fichier directement
        }
    }

    function removeImage() {
        imagePreviewStyle = `background-image: url(${imageUrl})`;
    }
</script>

<div class="cm-content-body form excerpt border-t border-[#eee] dark:border-[#444444] content">
    <div class="card-body ">
        <div class="avatar-upload flex items-center">
            <div class="relative ">
                <div class="avatar-preview border border-b-color p-2 mb-2.5 rounded-md">
                    <div class="block w-full h-[9.5rem] bg-cover bg-no-repeat bg-center" id="imagePreview" style={imagePreviewStyle} > 			
                    </div>
                </div>
                <div class="change-btn flex items-center flex-wrap">
                    <input type='file' class="hidden" id="imageUpload" on:change={readURL} accept=".png, .jpg, .jpeg">
                    <label for="imageUpload" class="btn btn-secondary sm:py-[0.719rem] px-4 sm:px-[1.563rem] py-2.5 sm:text-[15px] text-[13px] font-medium rounded-md bg-b-color leading-5 inline-block border border-b-color duration-500 hover:bg-[#f9f9f9] hover:border-[#f9f9f9] mb-0">
                        Sélectionner une image
                    </label>
                </div>
            </div>		
        </div>
    </div>
</div>
