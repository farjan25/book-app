// services/pdfProcessor.ts
import { PDFDocument, PDFFont} from 'pdf-lib';
import { supabase } from '@/lib/supabaseClient';
import { Settings } from '@/types';

const fontKit = require ('fontkit') 

import { StandardFonts, rgb } from 'pdf-lib'

function apply_exempt_pages(pages: number[], settings: Settings) {
  if (settings.half_title != 0) {
    pages.push(settings.half_title)
  }
  if (settings.title != 0) {
    pages.push(settings.title)
  }
  if (settings.copyright != 0) {
    pages.push(settings.copyright)
  }
  if (settings.dedications != 0) {
    pages.push(settings.dedications)
  }
  if (settings.table_of_contents[0] != 0 && settings.table_of_contents[1] != 0) {

    for (let i = settings.table_of_contents[0]; i <= settings.table_of_contents[1]; i++) {
      pages.push(i)
    }
  }
  if (settings.chapter_title_page != 0) {
    pages.push(settings.chapter_title_page)
  }
  if (settings.bibliography != 0) {
    pages.push(settings.bibliography)
  }
  if (settings.author_background != 0) {
    pages.push(settings.author_background)
  }
  if (settings.index != 0) {
    pages.push(settings.index)
  }

  pages = [...pages, ...settings.extra_pages.map(Number)]

  return pages
}

async function changePdf(pdfDoc: PDFDocument, differences: string[], settings: Settings) {

  let exempt_pages: number[] = []
  exempt_pages = apply_exempt_pages(exempt_pages, settings)

  const unique_pages = exempt_pages.filter((value, index, self) => self.indexOf(value) === index)

  pdfDoc = await applyMargin(pdfDoc, settings.margin)
  pdfDoc = await embedFonts(pdfDoc, settings.fonts)
  pdfDoc = await applyHeading(pdfDoc, settings.book_title, settings.author, settings.left_heading, settings.right_heading, settings.heading_height, settings.heading_side_margin, settings.heading_size, settings.body_font, unique_pages)
  pdfDoc = await scaledPdf(pdfDoc, settings.trim_Size, settings.bleed) //this is the problem
  //pdfDoc = await applyBleed(pdfDoc, settings.bleed)
  pdfDoc.registerFontkit(fontKit)
  pdfDoc = await applyNumbering(pdfDoc, settings.page_number_location, settings.extra_text_after, settings.extra_text_preceding, settings.numbering_vertical, settings.numbering_horizontal, settings.numbering_size, unique_pages, settings.body_font, settings.numbering_enabled)
  pdfDoc = await applyMarginCheck(pdfDoc, settings.margin_check, settings.bleed, settings.page_count)
  
  
  // then cover stuff

  return pdfDoc
  
}

export async function processPdf(pdf_url: string, settings: Settings, signal: AbortSignal): Promise<Blob> {

  // 1. Fetch the PDF
  const response = await fetch(pdf_url, { signal });
  if (!response.ok) throw new Error("Failed to fetch PDF from signed URL");

  const pdfBuffer = await response.arrayBuffer();

  // 2. Load PDF and apply modifications
  let pdfDoc = await PDFDocument.load(pdfBuffer)

  if (pdfDoc) {
    //console.log("there exists a pdfDoc")
  }

  // Modificaions here
  pdfDoc = await changePdf(pdfDoc, [], settings)

  // 3. Return the modified PDF as a Blob
  const modifiedBytes = await pdfDoc.save();

  return new Blob([modifiedBytes], { type: 'application/pdf' });
}






                        // changing stuff

const scaledPdf = async (pdfDoc: PDFDocument, size: number[], bleed: boolean) => {

  const newDoc = await PDFDocument.create()

  const x_size = size[0]
  const y_size = size[1]

  let newWidth = x_size * 72
  let newHeight = y_size * 72   //72

  if (bleed == true) {
    newWidth = newWidth + (0.125 * 72)
    newHeight = newHeight + (0.25 * 72)
  }

  const pages = pdfDoc.getPages()

  for (let i = 0; i < pages.length; i++) {
    
    const { width: origWidth, height: origHeight } = pages[i].getSize()

    if (size[0] == 0) {
      newWidth = origWidth
      newHeight = origHeight
    }
    
    const scaleX = newWidth / origWidth
    const scaleY = newHeight / origHeight
    const scale = Math.min(scaleX, scaleY)

    const [copiedPage] = await newDoc.copyPages(pdfDoc, [i])
    const embeddedPage = await newDoc.embedPage(copiedPage)

    const newPage = newDoc.addPage([newWidth, newHeight])

    const xOffset = (newWidth - origWidth * scale) / 2
    const yOffset = (newHeight - origHeight * scale) / 2

    newPage.drawPage(embeddedPage, {
      x: xOffset,
      y: yOffset,
      xScale: scale,
      yScale: scale,
    })
  }

  return newDoc
}

const applyBleed = async (pdfDoc: PDFDocument, state: boolean) => {

  const newDoc = await PDFDocument.create()

  const pages = pdfDoc.getPages()

  const bleedX = 0.125 * 72 // 0.125 inch = 9 points
  const bleedY = 0.25 * 72  // 0.25 inch = 18 points


  if (state == true) {
    for (let i = 0; i < pages.length; i++) {
    const originalPage = pages[i]
    const { width, height } = originalPage.getSize()

    const newWidth = width + bleedX
    const newHeight = height + bleedY

    // Create a new page in the destination doc
    const newPage = newDoc.addPage([newWidth, newHeight])

    // Copy the original page using copyPages
    const [copiedPage] = await newDoc.copyPages(pdfDoc, [i])
    const embeddedPage = await newDoc.embedPage(copiedPage)

    // Draw the copied page centered within the new, larger page
    newPage.drawPage(embeddedPage, {
      x: bleedX / 2,
      y: bleedY / 2,
      width,
      height
    })
  }

    return newDoc
  } 
  else {
    return pdfDoc
  }
}

const applyMarginCheck = async (pdfDoc: PDFDocument, margin_check: boolean, bleed: boolean, page_count: number) => {

  if (margin_check == true) {

    let margin_number = 0.25
    if (bleed == true) {
      margin_number = 0.375
    }

    let gutter_margin = 0.25

    if (page_count < 150) {
      gutter_margin = 0.375
    }
    if (page_count > 150 && page_count < 301) {
      gutter_margin = 0.5
    }
    if (page_count > 300 && page_count < 501) {
      gutter_margin = 0.625
    }
    if (page_count > 500 && page_count < 701) {
      gutter_margin = 0.75
    }
    if (page_count > 700) {
      gutter_margin = 0.875
    }
    const pages = pdfDoc.getPages()

    for (let i = 0; i < pages.length; i++) {
      const currentPage = pdfDoc.getPage(i)
      const { width, height } = currentPage.getSize()

      const page_number = i + 1
      if (page_number % 2 == 0) {
      //left facing, gutter on the right


        // this is the gutter
        currentPage.drawLine({
          start: { x: width, y: height / 2 },
          end: { x: width - (gutter_margin * 72), y: height / 2 },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })

        currentPage.drawLine({
          start: { x: width - (gutter_margin * 72), y: height},
          end: { x: width - (gutter_margin * 72), y: 0},
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })
        // this is the gutter

        currentPage.drawLine({
          start: { x: 0, y: height / 2 },
          end: { x: margin_number * 72, y: height / 2 },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })

        currentPage.drawLine({
          start: { x: margin_number * 72, y: 0 },
          end: { x: margin_number * 72, y: height },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })


      }
      if (page_number % 2 != 0) {
        // right facing, gutter on the left

        // this is the gutter
        currentPage.drawLine({
          start: { x: 0, y: height / 2 },
          end: { x: gutter_margin * 72, y: height / 2 },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })

        currentPage.drawLine({
          start: { x: gutter_margin * 72, y: 0 },
          end: { x: gutter_margin * 72, y: height },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })
        // this is the gutter

        currentPage.drawLine({
          start: { x: width, y: height / 2 },
          end: { x: width - (margin_number * 72), y: height / 2 },
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })

        currentPage.drawLine({
          start: { x: width - (margin_number * 72), y: height},
          end: { x: width - (margin_number * 72), y: 0},
          thickness: 3,
          color: rgb(1, 0, 0),
          opacity: 0.75,
        })

      }
        
        // left part was here

      currentPage.drawLine({
        start: { x: width / 2, y: height },
        end: { x: width / 2 , y: height - (margin_number * 72) },
        thickness: 3,
        color: rgb(1, 0, 0),
        opacity: 0.75,
      })

      currentPage.drawLine({
        start: { x: 0, y: height - (margin_number * 72) },
        end: { x: width, y: height - (margin_number * 72) },
        thickness: 3,
        color: rgb(1, 0, 0),
        opacity: 0.75,
      })

      // right part was here
      
      currentPage.drawLine({
        start: { x: width / 2, y: 0 },
        end: { x: width / 2, y: margin_number * 72},
        thickness: 3,
        color: rgb(1, 0, 0),
        opacity: 0.75,
      })

      currentPage.drawLine({
        start: { x: 0, y: margin_number * 72},
        end: { x: width, y: margin_number * 72},
        thickness: 3,
        color: rgb(1, 0, 0),
        opacity: 0.75,
      })
    }
  }

  return pdfDoc
}

const applyMargin = async (pdfDoc: PDFDocument, margins: number[]) => {
  
  const newDoc = await PDFDocument.create()

  const mtop = margins[0] * 72
  const mside = margins[1] * 72
  const mbottom = margins[2] * 72
  const mgutter = margins[3] * 72

  const pages = pdfDoc.getPages()

  for (let i = 0; i < pages.length; i++) {
    const originalPage = pages[i]
    const { width, height } = originalPage.getSize()

    // Calculate new page size
    const newWidth = width + mside + mgutter
    const newHeight = height + mtop + mbottom

    const newPage = newDoc.addPage([newWidth, newHeight])

    // Copy and embed the original page
    const [copiedPage] = await newDoc.copyPages(pdfDoc, [i])
    const embeddedPage = await newDoc.embedPage(copiedPage)

    // Offset based on which sides we extended
    const xOffset = mgutter
    const yOffset = mbottom

    const page_number = i + 1

    if (page_number % 2 == 0) {
      //left facing gutter on the right
        newPage.drawPage(embeddedPage, {
        x: mside,
        y: mbottom,
        width,
        height
      }) 
    }
    if (page_number % 2 != 0) {
      // right facing, gutter on the left
      newPage.drawPage(embeddedPage, {
        x: mgutter,
        y: mbottom,
        width,
        height
      }) 
    }
  }

  return newDoc
}


const getFontUrl = (fontName: string) => {
  const fontId = fontName.toLowerCase().replace(/\s+/g, "-")
  return `https://cdn.jsdelivr.net/fontsource/fonts/${fontId}@latest/latin-400-normal.ttf`
}

const embedFonts = async (pdfDoc: PDFDocument, fonts: string[]) => {

  pdfDoc.registerFontkit(fontKit)

  for (const element of fonts) {
    if (element == '') {
      continue
    }

    const url = getFontUrl(element)
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`Failed to load font ${element}: ${resp.status}`)
    const fontBytes = await resp.arrayBuffer()

    pdfDoc.registerFontkit(fontKit)
    const fontFromElement = await pdfDoc.embedFont(fontBytes)
  }
  
  return pdfDoc
}

const applyHeading = async (pdfDoc: PDFDocument, title: string, author: string, left_heading: string, right_heading: string, heading_height: number, side_margin: number, size: number, body_font: string, exempt_pages: number[]) => {

  const pages = pdfDoc.getPages()

  let customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  if (body_font != "None" && body_font != "") {
    const url = getFontUrl(body_font)
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`Failed to load font ${body_font}: ${resp.status}`)
    const fontBytes = await resp.arrayBuffer()

    customFont = await pdfDoc.embedFont(fontBytes)
  }

  for (let i = 0; i < pages.length; i++) {

    if (exempt_pages.includes(i + 1)) {
      //console.log("not rendering in", i + 1)
      continue
    }
    
    
    const page = pages[i]
    const { width, height } = page.getSize()

    if (i % 2 == 0) {
      const left_y = height - heading_height
      const left_x = side_margin
      let left_text = ""

      if (left_heading == "title") {
        left_text = title
      }
      if (left_heading == "name") {
        left_text = author
      }


      page.drawText(left_text, {
        x: left_x,
        y: left_y,
        size: size,
        font: customFont
      })
    } else {
      // right side
      const right_y = height - heading_height

      let right_text = ""
      if (right_heading == "title") {
        right_text = title
      }
      if (right_heading == "name") {
        right_text = author
      }
      //const rightWidth = customFont.widthOfTextAtSize(right_text, size)

      const right_x = side_margin // - rightWidth

      page.drawText(right_text, {
        x: right_x,
        y: right_y,
        size: size,
        font: customFont
      })
    }

  }
  
  return pdfDoc
}

const applyNumbering = async (pdfDoc: PDFDocument, location: string, extra_after: string, extra_before: string, vertical_margin: number, horizontal_margin: number, size: number, exempt_pages: number[], body_font: string, numbering_enabled: boolean) => {

  const pages = pdfDoc.getPages()

  let customFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  if (body_font != "None" && body_font != "") {
    const url = getFontUrl(body_font)
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`Failed to load font ${body_font}: ${resp.status}`)
    const fontBytes = await resp.arrayBuffer()

    customFont = await pdfDoc.embedFont(fontBytes)
  }

  if (numbering_enabled == true) {
    for (let i = 0; i < pages.length; i++) {

      if (exempt_pages.includes(i + 1)) {
        continue
      }
      
      const page = pages[i]
      const { width, height } = page.getSize()

      const text = extra_before + String(i + 1) + extra_after
      
      let x = horizontal_margin
      let y = vertical_margin
      const textwidth = customFont.widthOfTextAtSize(text, size)
    
      if (location == "top_right") {
        x = width - horizontal_margin - textwidth
        y = height - vertical_margin
      }
      if (location == "top_middle") {
        x = width / 2 - (textwidth / 2)
        y = height - vertical_margin
      }
      if (location == "top_left") {
        x = horizontal_margin
        y = height - vertical_margin
      }
      if (location == "bottom_right") {
        x = width - horizontal_margin - textwidth
        y = vertical_margin
      }
      if (location == "bottom_middle") {
        x = width / 2 - (textwidth / 2)
        y = vertical_margin
      }
      if (location == "bottom_left") {
        x = horizontal_margin
        y = vertical_margin
      }

      page.drawText(text, {
        x: x,
        y: y,
        size: size,
        font: customFont
      })
    }
  } else {
    return pdfDoc
  }
  
  return pdfDoc
}

export const countPages = async(pdfUrl: string) => {
  const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)

  const pageCount = pdfDoc.getPageCount()

  return pageCount
}

export const createNewCoverFile = async(trim_size: number[]) => {

  const coverDoc = await PDFDocument.create()

  const x_size_inches = 2 * (0.125) + 2 * (trim_size[0])  // + spine width
  const y_size_inches = 2 * 0.125 + (trim_size[1])

  const x_size = x_size_inches * 72
  const y_size = y_size_inches * 72

  const page = coverDoc.addPage([x_size, y_size])

  const modifiedBytes = await coverDoc.save()
  return new Blob([modifiedBytes], { type: 'application/pdf' });
}

async function createCoverFile(page_count: number, trim_size: number[], paper_type: string) {

  const new_doc = await PDFDocument.create()

  let spine_width = 0
  if (paper_type == "White") {
    spine_width = 0.002252 * page_count
  }
  if (paper_type == "Cream") {
    spine_width = 0.0025 * page_count
  }
  if (paper_type == "Standard color paper") {
    spine_width = 0.002347 * page_count
  }
  if (paper_type == "Premium color paper") {
    spine_width = 0.002252 * page_count 
  }


  const x_size_inches = 2 * (0.125) + 2 * (trim_size[0]) + spine_width
  const y_size_inches = 2 * 0.125 + (trim_size[1])

  let x_size = x_size_inches * 72 
  let y_size = y_size_inches * 72

  if (trim_size[0] == 0) {
    x_size= 5 * 72
    y_size = 3 * 72
  }

  if (paper_type == "") {
    x_size= 5 * 72
    y_size = 3 * 72
  }

  const page = new_doc.addPage([x_size, y_size])

  const font = await new_doc.embedFont(StandardFonts.Helvetica);

  if (trim_size[0] == 0) {
    const trimSizeText = "Please select a valid trim size"
    const textSize = font.widthOfTextAtSize(trimSizeText, 20)
    page.drawText(trimSizeText, {
      x: (x_size / 2) - (textSize / 2),
      y: y_size / 2,
      size: 20,
      font: font
    })
    console.log("the trim size is 0")
    return new_doc
  }

  if (paper_type == "") {
    const trimSizeText = "Please select a paper type"
    const textSize = font.widthOfTextAtSize(trimSizeText, 20)
    page.drawText(trimSizeText, {
      x: (x_size / 2) - (textSize / 2),
      y: y_size / 2,
      size: 20,
      font: font
    })
    console.log("the trim size is 0")
    return new_doc
  }

  page.drawRectangle({
    x: 0.125 * 72,
    y: 0.125 * 72,
    width: x_size - (0.125 * 72 * 2),
    height: y_size - (0.125 * 72 * 2),
    borderWidth: 4,
    borderColor: rgb(1, 0, 0),
    borderOpacity: 0.2,
    color: rgb(1, 1, 1),
    opacity: 1,
  })

  page.drawLine({
    start: { x: ((trim_size[0]+ 0.125) * 72 ), y: y_size },
    end: { x: ((trim_size[0] + 0.125) * 72 ), y: 0 },
    thickness: 2,
    color: rgb(1, 0, 0),
    opacity: 0.5,
  })

  page.drawLine({
    start: { x: ((trim_size[0] + 0.125 + spine_width) * 72), y: y_size },
    end: { x: ((trim_size[0] + 0.125 + spine_width) * 72), y: 0 },
    thickness: 2,
    color: rgb(1, 0, 0),
    opacity: 0.5,
  })

  const trimText = "Trim Size: " + String(trim_size[0]) + `" x ` + String(trim_size[1]) + `"`
  const trimTextSize = font.widthOfTextAtSize(trimText, 16)

  const spineWidthText = "Spine Width: " + String(Math.trunc(spine_width * 1000) / 1000) + `"`
  const spineWidthTextSize = font.widthOfTextAtSize(spineWidthText, 16)

  const detailText = String(page_count) + " pages " + String(paper_type)
  const detailTextSize = font.widthOfTextAtSize(detailText, 16)

  page.drawText(trimText, {
    x: (((trim_size[0] + 0.125 + spine_width + (trim_size[0] / 2)) * 72) - trimTextSize / 2),
    y: (trim_size[1] / 8) * 7 * 72,
    size: 16,
  })
  page.drawText(spineWidthText, {
    x: (((trim_size[0] + 0.125 + spine_width + (trim_size[0] / 2)) * 72) - spineWidthTextSize / 2),
    y: (trim_size[1] / 8) * 6 * 72,
    size: 16,
  })

  page.drawText(detailText, {
    x: (((trim_size[0] + 0.125 + spine_width + (trim_size[0] / 2)) * 72) - detailTextSize / 2),
    y: (trim_size[1] / 8) * 5 * 72,
    size: 16,
  })

  page.drawRectangle({
    x: (0.125 + trim_size[0] - 2 - 0.25) * 72,
    y: (0.125 + 0.25) * 72,
    width: (2) * 72,
    height: (1.2) * 72,
    color: rgb(1, 0, 0),
    opacity: 0.3,
    borderOpacity: 0.75,
  })

  return new_doc
}

async function applyImages(new_doc: PDFDocument, project_id: number, page_count: number, trim_size: number[], paper_type: string, cover_bool: boolean, spine_bool: boolean, back_bool: boolean, coverFile: File | null, spineFile: File | null, backFile: File | null) {

  // front section
  const page = new_doc.getPage(0)

  let spine_width = 0
  if (paper_type == "White") {
    spine_width = 0.002252 * page_count
  }
  if (paper_type == "Cream") {
    spine_width = 0.0025 * page_count
  }
  if (paper_type == "Standard color paper") {
    spine_width = 0.002347 * page_count
  }
  if (paper_type == "Premium color paper") {
    spine_width = 0.002252 * page_count 
  }


  if (coverFile && cover_bool) {
    
    const coverBlob = coverFile // Blob
    const coverBytes = await coverBlob.arrayBuffer()
    let coverImage;

    if (coverFile.type === "image/png") {
      coverImage = await new_doc.embedPng(coverBytes);
    } else if (coverFile.type === "image/jpeg") {
      coverImage = await new_doc.embedJpg(coverBytes);
    } else {
      throw new Error(`Unsupported image type: ${coverFile.type}`);
    }

    page.drawImage(coverImage, {
      x: (0.125 + trim_size[0] + spine_width) * 72,
      y: 0,
      width: (trim_size[0] + 0.125) * 72,
      height: (trim_size[1] + 0.25) * 72,
    })
    
  }

  if (spineFile && spine_bool) {
    const spineBlob = spineFile // Blob
    const spineBytes = await spineBlob.arrayBuffer()
    let spineImage;

    if (spineFile.type === "image/png") {
      spineImage = await new_doc.embedPng(spineBytes);
    } else if (spineFile.type === "image/jpeg") {
      spineImage = await new_doc.embedJpg(spineBytes);
    } else {
      throw new Error(`Unsupported image type: ${spineFile.type}`);
    }
    page.drawImage(spineImage, {
      x: (0.125 + trim_size[0]) * 72,
      y: 0,
      width: spine_width * 72,
      height: (0.25 + trim_size[1]) * 72,
    })
  
  }
  
  if (backFile && back_bool) {
    const backBlob = backFile // Blob
    const backBytes = await backBlob.arrayBuffer()
    let backImage;

    if (backFile.type === "image/png") {
      backImage = await new_doc.embedPng(backBytes);
    } else if (backFile.type === "image/jpeg") {
      backImage = await new_doc.embedJpg(backBytes);
    } else {
      throw new Error(`Unsupported image type: ${backFile.type}`);
    }

    page.drawImage(backImage, {
      x: 0,
      y: 0,
      width: (0.125 + trim_size[0]) * 72,
      height: (0.25 + trim_size[1]) * 72,
    })
  }
  
  return new_doc
}

async function changeCoverPdf(pdfDoc: PDFDocument, settings: Settings, coverFile: File | null, spineFile: File | null, backFile: File | null) {
  

  let new_doc = await createCoverFile(settings.page_count, settings.trim_Size, settings.paper_type)  // -- based on paper type, trim size, page count also include the ISBN
  new_doc = await applyImages(new_doc, settings.project_id, settings.page_count, settings.trim_Size, settings.paper_type, settings.cover, settings.spine, settings.back, coverFile, spineFile, backFile)

  return new_doc
}


export async function processCoverFile(pdf_url: string, settings: Settings, coverFile: File | null, spineFile: File | null, backFile: File | null): Promise<Blob> {

  // 1. Fetch the PDF

  const response = await fetch(pdf_url);
  if (!response.ok) throw new Error("Failed to fetch PDF from signed URL");

  const pdfBuffer = await response.arrayBuffer();

  // 2. Load PDF and apply modifications
  let pdfDoc = await PDFDocument.load(pdfBuffer)

  // Modificaions here
  pdfDoc = await changeCoverPdf(pdfDoc, settings, coverFile, spineFile, backFile)

  // 3. Return the modified PDF as a Blob
  const modifiedBytes = await pdfDoc.save();

  return new Blob([modifiedBytes], { type: 'application/pdf' });
}