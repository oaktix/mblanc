import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { Document, Page, Text } from "@react-pdf/renderer";

async function testPdf() {
  console.log(">>> Testing simple PDF generation...");
  try {
    const buffer = await renderToBuffer(
      React.createElement(Document, {}, 
        React.createElement(Page, {}, 
          React.createElement(Text, {}, "Hello World")
        )
      )
    );
    console.log(">>> Success! Buffer size:", buffer.length);
  } catch (err) {
    console.error(">>> Failed:", err);
  }
}

testPdf();
