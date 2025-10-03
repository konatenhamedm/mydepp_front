<script lang="ts">
   /*  import QRCode from 'svelte-qr-code'; */
    import QRCode from '@castlenine/svelte-qrcode';
    export let text:any = "";
  
   
    let size:any = 200; // Taille du QR code en pixels
    let level = 'H'; // Correction d'erreur (L, M, Q, H)
    let fgColor = '#000000'; // Couleur du QR code
    let bgColor = '#FFFFFF'; // Couleur de fond
  </script>
  
<!--   <QRCode {text} {size} {level} {fgColor} {bgColor} /> -->
<QRCode data={text} size={150}  shape="circle" backgroundColor="#000000" color="#ffffff" haveBackgroundRoundedEdges/>