//commands based on https://github.com/humbertopiaia/escpos-commands-js/blob/master/src/commands.js
//all the commands below may vary by printer, check the manual
export const commands = {
  LF: '\x0a',
  ESC: '\x1b',
  FS: '\x1c',
  GS: '\x1d',
  US: '\x1f',
  FF: '\x0c',
  DLE: '\x10',
  DC1: '\x11',
  DC4: '\x14',
  EOT: '\x04',
  NUL: '\x00',
  EOL: '\n',
  HORIZONTAL_LINE: {
    HR_58MM: '================================',
    HR2_58MM: '********************************'
  },
  FEED_CONTROL_SEQUENCES: {
    CTL_LF: '\x0a', // Print and line feed  //Impresión y alimentación de línea.
    CTL_FF: '\x0c', // Form feed            //Alimentación de formulario.
    CTL_CR: '\x0d', // Carriage return      //Retorno de carro
    CTL_HT: '\x09', // Horizontal tab       //Pestaña horizontal
    CTL_VT: '\x0b', // Vertical tab         //Pestaña vertical
  },
  LINE_SPACING: {
    LS_DEFAULT: '\x1b\x32',
    LS_SET: '\x1b\x33'
  },
  HARDWARE: {
    HW_INIT: '\x1b\x40', // Clear data in buffer and reset modes //Borrar datos en modos de búfer y reinicio.
    HW_SELECT: '\x1b\x3d\x01', // Printer select  //Impresora seleccionada.
    HW_RESET: '\x1b\x3f\x0a\x00', // Reset printer hardware  //Restablecer hardware de la impresora.
  },
  CASH_DRAWER: {
    CD_KICK_2: '\x1b\x70\x00', // Sends a pulse to pin 2 []  // Envía un pulso al pin 2 []
    CD_KICK_5: '\x1b\x70\x01', // Sends a pulse to pin 5 []  //Envía un pulso al pin 5 []
  },
  MARGINS: {
    BOTTOM: '\x1b\x4f', // Fix bottom size //Arreglar el tamaño inferior.
    LEFT: '\x1b\x6c', // Fix left size   //Arreglar el tamaño izquierdo
    RIGHT: '\x1b\x51', // Fix right size  //Arreglar el tamaño correcto
  },
  PAPER: {
    PAPER_FULL_CUT: '\x1d\x56\x00', // Full cut paper //Papel de corte completo.
    PAPER_PART_CUT: '\x1d\x56\x01', // Partial cut paper  //Papel cortado parcial
    PAPER_CUT_A: '\x1d\x56\x41', // Partial cut paper
    PAPER_CUT_B: '\x1d\x56\x42', // Partial cut paper
  },
  TEXT_FORMAT: {
    TXT_NORMAL: '\x1b\x21\x00', // Normal text  //Texto normal
    TXT_2HEIGHT: '\x1b\x21\x10', // Double height text  //Texto de doble altura.
    TXT_2WIDTH: '\x1b\x21\x20', // Double width text    //Texto de doble ancho.
    TXT_4SQUARE: '\x1b\x21\x30', // Double width & height text   //Texto doble ancho y alto
    TXT_CUSTOM_SIZE: function (width, height) { // other sizes   //otros tamaños
      var widthDec = (width - 1) * 16;
      var heightDec = height - 1;
      var sizeDec = widthDec + heightDec;
      return '\x1d\x21' + String.fromCharCode(sizeDec);
    },

    TXT_HEIGHT: {
      1: '\x00',
      2: '\x01',
      3: '\x02',
      4: '\x03',
      5: '\x04',
      6: '\x05',
      7: '\x06',
      8: '\x07'
    },
    TXT_WIDTH: {
      1: '\x00',
      2: '\x10',
      3: '\x20',
      4: '\x30',
      5: '\x40',
      6: '\x50',
      7: '\x60',
      8: '\x70'
    },

    TXT_UNDERL_OFF: '\x1b\x2d\x00', // Underline font OFF  //Subrayar fuente DESACTIVADA
    TXT_UNDERL_ON: '\x1b\x2d\x01', // Underline font 1-dot ON   //Subrayar fuente de 1 punto ACTIVADA
    TXT_UNDERL2_ON: '\x1b\x2d\x02', // Underline font 2-dot ON  //Subrayar fuente de 2 puntos ACTIVADA
    TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF //Letra negrita DESACTIVADA
    TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON  // Letra negrita ACTIVADA
    TXT_ITALIC_OFF: '\x1b\x35', // Italic font OFF  // Letara Italica DESACTIVADA
    TXT_ITALIC_ON: '\x1b\x34', // Italic font ON    // Letara Italica ACTIVADA
    TXT_FONT_A: '\x1b\x4d\x00', // Font type A    //Tipo de letra A
    TXT_FONT_B: '\x1b\x4d\x01', // Font type B    //Tipo de letra B
    TXT_FONT_C: '\x1b\x4d\x02', // Font type C    //Tipo de letra C
    TXT_ALIGN_LT: '\x1b\x61\x00', // Left justification   //Justificación a la izquierda
    TXT_ALIGN_CT: '\x1b\x61\x01', // Centering      //Centrado
    TXT_ALIGN_RT: '\x1b\x61\x02', // Right justification    //Justificación derecha
  }
}
