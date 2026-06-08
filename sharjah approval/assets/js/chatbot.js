/*
 * Sharjah Approval - Smart Chatbot
 * Rule-based automatic reply system
 */

(function () {
  // Knowledge base - ordered by priority (specific first, generic last)
  var topics = [
    // Greetings
    {
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'assalam', 'salam', 'marhaba'],
      reply: '👋 Hello! Welcome to Sharjah Approval. How can I help you today?\n\nYou can ask me about our services, pricing, timelines, or anything else!',
      follow: ['Our Services', 'Get a Quote', 'Contact Us']
    },

    // Thanks / Goodbye
    {
      keys: ['thank', 'thanks', 'shukran', 'bye', 'goodbye', 'see you'],
      reply: '🙏 Thank you for contacting Sharjah Approval! If you need further assistance, feel free to reach out anytime.\n\n📞 +971 6 561 0096\n💬 WhatsApp: +971 54 232 3854',
      follow: []
    },

    // === INDIVIDUAL SERVICES ===

    // Municipality
    {
      keys: ['municipality', 'building permit', 'trade license', 'signboard', 'completion certificate', 'fit-out', 'fitout'],
      reply: '🏛️ Municipality Approval Services:\n\n• Building Permits & Construction NOCs\n• Trade License Approvals\n• Signboard & Advertisement Permits\n• Fit-out & Renovation Approvals\n• Completion Certificates\n• Commercial & Industrial Permits\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Trade license, drawings, title deed\n\n🔗 Learn more: services/sharjah-municipality-approvals',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Civil Defense
    {
      keys: ['civil defense', 'fire safety', 'fire certificate', 'fire alarm', 'fire fighting', 'evacuation', 'scd'],
      reply: '🔥 Civil Defense Approval Services:\n\n• Fire Safety Certificates\n• Emergency Evacuation Plans\n• Fire Fighting System Approvals\n• Fire Alarm System Certifications\n• Annual Safety Inspections\n• SCD Compliance Documentation\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: Floor plans, fire system drawings, trade license\n\n🔗 Learn more: services/civil-defense-approvals',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // SEWA
    {
      keys: ['sewa', 'electricity', 'water connection', 'meter', 'load increase', 'power supply', 'electric'],
      reply: '⚡ SEWA Approval Services:\n\n• New Electricity Connections\n• Water Supply Applications\n• Meter Installations & Transfers\n• Load Increase Requests\n• Temporary Power Supply\n• Disconnection & Reconnection\n\n⏱️ Timeline: 3-7 working days\n📄 Docs needed: Title deed/tenancy, trade license, NOC from landlord\n\n🔗 Learn more: services/sewa-approvals',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Planning & Survey
    {
      keys: ['planning', 'survey', 'land survey', 'affection plan', 'plot boundary', 'demarcation'],
      reply: '📐 Planning & Survey Services:\n\n• Land Surveys & Topographic Mapping\n• Affection Plan Preparation\n• Plot Boundary Demarcation\n• Planning Department Approvals\n• Site Assessment Reports\n• GIS Mapping Services\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Title deed, site plan, owner ID\n\n🔗 Learn more: services/planning-survey',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // RTA
    {
      keys: ['rta', 'road crossing', 'parking noc', 'traffic impact', 'transport', 'road permit'],
      reply: '🚗 RTA Sharjah Approval Services:\n\n• Road Crossing Permits\n• Access & Entry Approvals\n• Parking NOCs\n• Traffic Impact Assessments\n• Transportation Clearances\n• Temporary Road Closure Permits\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Site plan, traffic study, trade license\n\n🔗 Learn more: services/rta-sharjah-approvals',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Environmental
    {
      keys: ['environment', 'waste management', 'pollution', 'green building', 'eia', 'environmental impact'],
      reply: '🌿 Environmental Services:\n\n• Environmental Impact Assessments (EIA)\n• Waste Management Permits\n• Pollution Control Certificates\n• Green Building Compliance\n• Environmental Clearances\n• Sustainability Reports\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: Project details, site plan, EIA report\n\n🔗 Learn more: services/environmental-waste',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Drainage & Irrigation
    {
      keys: ['drainage', 'irrigation', 'storm water', 'stormwater', 'water management'],
      reply: '💧 Drainage & Irrigation Services:\n\n• Storm Water Drainage Connections\n• Irrigation System Approvals\n• Water Management NOCs\n• Infrastructure Permits\n• Drainage Network Approvals\n• Flood Risk Assessments\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Drainage plans, site layout, engineering drawings\n\n🔗 Learn more: services/drainage-irrigation',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Etisalat
    {
      keys: ['etisalat', 'fibre optic', 'telephone line'],
      reply: '📡 Etisalat NOC Services:\n\n• Fibre Optic Connection NOC\n• Telecom Duct Crossing Permits\n• ELV System Approvals\n• Telephone Line Approvals\n• Infrastructure Relocation NOC\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Site plan, telecom drawings, trade license\n\n🔗 Learn more: services/etisalat-approvals',
      follow: ['du NOCs', 'Get a Quote', 'View Timelines']
    },

    // du
    {
      keys: ['du ', 'du noc', 'broadband'],
      reply: '📶 du NOC Services:\n\n• Fibre & Broadband Connection NOC\n• Telecom Duct Crossing Permits\n• ELV System Approvals\n• Mobile Tower & Infrastructure NOC\n• Infrastructure Protection NOC\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Site plan, telecom drawings, trade license\n\n🔗 Learn more: services/du-approvals',
      follow: ['Etisalat NOCs', 'Get a Quote', 'View Timelines']
    },

    // Telecom (general)
    {
      keys: ['telecom', 'network', 'communication', 'internet', 'fiber'],
      reply: '📡 Telecom & ELV Services:\n\nWe handle approvals for both major telecom providers:\n\n📶 Etisalat NOCs — Fibre optic, telephone lines, ELV systems\n📶 du NOCs — Broadband, mobile towers, infrastructure protection\n\nWhich provider do you need help with?',
      follow: ['Etisalat NOCs', 'du NOCs', 'Get a Quote']
    },

    // Demolition & Construction
    {
      keys: ['demolition', 'construction permit', 'structural modification', 'demolish'],
      reply: '🏗️ Demolition & Construction Services:\n\n• Demolition Permits & Approvals\n• Construction Permits\n• Structural Modification Approvals\n• Safety Compliance Certificates\n• Hoarding & Scaffolding Permits\n• Excavation Approvals\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: Structural drawings, safety plan, trade license\n\n🔗 Learn more: services/demolition-construction',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // NOC Services
    {
      keys: ['noc', 'no objection', 'clearance certificate', 'multi-authority'],
      reply: '📋 NOC Services:\n\n• Single & Multi-Authority NOCs\n• Inter-departmental Coordination\n• Clearance Certificates\n• Authority-specific NOCs\n• Renewal & Modification NOCs\n• Express NOC Processing\n\n⏱️ Timeline: 2-5 working days\n📄 Docs needed: Varies by authority - we guide you!\n\n🔗 Learn more: services/noc-services',
      follow: ['Get a Quote', 'All Services', 'View Timelines']
    },

    // SEDD Commercial Licensing
    {
      keys: ['sedd', 'commercial license', 'industrial permit', 'trade name', 'economic development', 'business license'],
      reply: '💼 SEDD Licensing Services:\n\n• Commercial License Approvals\n• Industrial Permits\n• Trade Name Registration\n• Professional Licensing\n• Business Activity Permits\n• License Renewal & Amendments\n\n⏱️ Timeline: 3-7 working days\n📄 Docs needed: Passport, Emirates ID, tenancy contract, trade name\n\n🔗 Learn more: services/sedd-commercial-licensing',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // SAIF Zone
    {
      keys: ['saif zone', 'saif', 'sharjah airport', 'free zone warehouse'],
      reply: '✈️ SAIF Zone Approval Services:\n\n• Warehouse Construction Permits\n• Industrial Unit Fit-out Approvals\n• Office Modification Permits\n• HSE Compliance Certificates\n• Infrastructure NOCs\n• Building Completion Certificates\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: SAIF Zone license, drawings, contractor details\n\n🔗 Learn more: services/saif-zone-approvals',
      follow: ['Get a Quote', 'HFZA', 'View Timelines']
    },

    // Hamriyah Free Zone
    {
      keys: ['hamriyah', 'hfza', 'hamriyah free zone', 'heavy industrial'],
      reply: '🏭 Hamriyah Free Zone (HFZA) Services:\n\n• Oil & Gas Facility Approvals\n• Heavy Industrial Project Permits\n• Marine Construction Approvals\n• Environmental Compliance\n• Warehouse & Factory Permits\n• Safety & HSE Certifications\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: HFZA license, engineering drawings, EIA report\n\n🔗 Learn more: services/hamriyah-free-zone',
      follow: ['Get a Quote', 'SAIF Zone', 'View Timelines']
    },

    // SRTIP
    {
      keys: ['srtip', 'research park', 'technology park', 'innovation park'],
      reply: '🔬 SRTIP Approval Services:\n\n• Office Fit-out Permits\n• Technology Facility Approvals\n• R&D Center Construction Permits\n• Lab & Clean Room Compliance\n• Infrastructure Modification NOCs\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: SRTIP license, drawings, project scope\n\n🔗 Learn more: services/srtip-approvals',
      follow: ['Get a Quote', 'Shams Media City', 'View Timelines']
    },

    // Shams Media City
    {
      keys: ['shams', 'media city', 'sharjah media'],
      reply: '🎬 Shams Media City Services:\n\n• Office Fit-out Permits\n• Signage Approvals\n• Commercial Renovation Permits\n• MEP Modification Approvals\n• Studio & Production Facility Permits\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Shams license, drawings, contractor details\n\n🔗 Learn more: services/shams-media-city',
      follow: ['Get a Quote', 'SRTIP', 'View Timelines']
    },

    // Sharjah Health Authority
    {
      keys: ['health authority', 'clinic', 'hospital', 'pharmacy', 'medical facility', 'healthcare'],
      reply: '🏥 Sharjah Health Authority Services:\n\n• Clinic & Hospital Permits\n• Pharmacy Fit-out Approvals\n• Medical Facility Licensing\n• Healthcare Construction Permits\n• Laboratory Setup Approvals\n• Health Compliance Certificates\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: Health license, facility drawings, medical equipment list\n\n🔗 Learn more: services/sharjah-health-authority',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Commerce & Tourism
    {
      keys: ['commerce', 'tourism', 'hotel', 'restaurant', 'hospitality'],
      reply: '🏨 Commerce & Tourism Services:\n\n• Hotel Licensing & Permits\n• Restaurant Approval Services\n• Tourism Facility Permits\n• Hospitality Compliance\n• Event Venue Approvals\n• Tourism Activity Licenses\n\n⏱️ Timeline: 5-10 working days\n📄 Docs needed: Trade license, drawings, tourism classification docs\n\n🔗 Learn more: services/commerce-tourism',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Sharjah Ports Authority
    {
      keys: ['port', 'marine', 'waterfront', 'maritime', 'harbor', 'harbour'],
      reply: '⚓ Sharjah Ports Authority Services:\n\n• Port Construction Approvals\n• Marine Works Permits\n• Waterfront Development NOCs\n• Maritime Operations Licensing\n• Jetty & Berth Construction\n• Port Safety Compliance\n\n⏱️ Timeline: 7-14 working days\n📄 Docs needed: Port authority license, marine drawings, EIA\n\n🔗 Learn more: services/sharjah-ports-authority',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Ministry of Energy & Infrastructure
    {
      keys: ['ministry of energy', 'energy', 'infrastructure', 'oil and gas', 'federal'],
      reply: '⛽ Ministry of Energy & Infrastructure Services:\n\n• Federal Infrastructure Permits\n• Oil & Gas Project Approvals\n• Energy Facility Compliance\n• Pipeline & Utility NOCs\n• Federal Road Crossing Permits\n• Infrastructure Impact Assessments\n\n⏱️ Timeline: 10-21 working days\n📄 Docs needed: Project scope, engineering drawings, environmental assessment\n\n🔗 Learn more: services/ministry-energy-infrastructure',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // Master Developer NOCs
    {
      keys: ['developer noc', 'master developer', 'arada', 'tilal', 'shurooq', 'alef'],
      reply: '🏢 Master Developer NOC Services:\n\n• Arada Development NOCs\n• Tilal Properties Approvals\n• Shurooq Project NOCs\n• Alef Group Clearances\n• Construction Modification NOCs\n• Fit-out & Renovation Approvals\n\n⏱️ Timeline: 3-7 working days\n📄 Docs needed: Unit ownership docs, drawings, developer application forms\n\n🔗 Learn more: services/master-developer-nocs',
      follow: ['Get a Quote', 'Required Documents', 'View Timelines']
    },

    // === BUSINESS INFO ===

    // All Services Overview
    {
      keys: ['service', 'what do you offer', 'what services', 'all services', 'list of services'],
      reply: '📋 Our 21 Services:\n\n🏛️ Municipality Approvals\n🔥 Civil Defense (SCD)\n⚡ SEWA (Electricity & Water)\n📐 Planning & Survey\n🚗 RTA Sharjah\n🌿 Environmental (EPAA)\n💧 Drainage & Irrigation\n📡 Etisalat NOCs\n📶 du NOCs\n🏗️ Construction Permits\n📋 NOC Services\n💼 SEDD Licensing\n✈️ SAIF Zone\n🏭 HFZA Approvals\n🔬 SRTIP\n🎬 Shams Media City\n🏥 Health Authority\n🏨 Commerce & Tourism\n⚓ Ports Authority\n⛽ Ministry of Energy\n🏢 Developer NOCs\n\nAsk about any specific service for details!',
      follow: ['Municipality', 'Civil Defense', 'SEWA', 'Get a Quote']
    },

    // Pricing
    {
      keys: ['price', 'cost', 'fee', 'charge', 'how much', 'rate', 'quote', 'quotation', 'budget', 'expensive', 'cheap', 'affordable'],
      reply: '💰 Pricing Information:\n\nWe offer transparent, competitive pricing with NO hidden charges.\n\n✅ Free initial consultation\n✅ Detailed quotation upfront\n✅ Government fees included in quote\n✅ No surprise charges\n\nPricing varies by service type and complexity. Contact us for a free quote:\n\n📞 +971 6 561 0096\n💬 WhatsApp: +971 54 232 3854',
      follow: ['Our Services', 'View Timelines', 'Contact Us']
    },

    // Timelines
    {
      keys: ['timeline', 'how long', 'duration', 'time take', 'turnaround', 'fast', 'urgent', 'express', 'quick'],
      reply: '⏱️ Approval Timelines:\n\n• NOC Services: 2-5 working days\n• SEWA Connections: 3-7 working days\n• Municipality Permits: 5-10 working days\n• RTA Approvals: 5-10 working days\n• Planning & Survey: 5-10 working days\n• Civil Defense: 7-14 working days\n• Environmental: 7-14 working days\n\n⚡ Express processing available for urgent requests!\n\nTimelines may vary based on project complexity.',
      follow: ['Get a Quote', 'Our Services', 'Contact Us']
    },

    // Documents
    {
      keys: ['document', 'requirement', 'what do i need', 'paperwork', 'what papers', 'checklist'],
      reply: '📄 Common Documents Required:\n\n• Trade License (copy)\n• Passport & Emirates ID\n• Title Deed or Tenancy Contract\n• Architectural/Engineering Drawings\n• Existing NOCs or Certificates\n• Power of Attorney (if applicable)\n\n📌 Exact requirements vary by service. During your FREE consultation, we provide a complete checklist tailored to your needs.\n\n📞 Call: +971 6 561 0096',
      follow: ['Our Services', 'Get a Quote', 'How It Works']
    },

    // Location / Address
    {
      keys: ['location', 'address', 'office', 'where', 'visit', 'map', 'direction'],
      reply: '📍 Our Office Location:\n\n10th Floor, City Gate Tower\nAl Ittihad Street, Sharjah, UAE\n\n🕐 Working Hours:\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed\n\n📞 Phone: +971 6 561 0096\n📧 Email: info@sharjahapproval.com\n\n💡 Good news: In most cases, you don\'t need to visit our office. We handle everything remotely!',
      follow: ['Our Services', 'Get a Quote', 'Contact Us']
    },

    // Working Hours
    {
      keys: ['hours', 'timing', 'open', 'close', 'working day', 'weekend', 'saturday', 'sunday', 'friday'],
      reply: '🕐 Working Hours:\n\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday & Sunday: Closed\n\n💬 WhatsApp support available 24/7!\nSend us a message anytime: +971 54 232 3854',
      follow: ['Contact Us', 'Our Services']
    },

    // Contact
    {
      keys: ['contact', 'phone', 'call', 'email', 'whatsapp', 'reach', 'talk to'],
      reply: '📞 Contact Sharjah Approval:\n\n📱 Phone: +971 6 561 0096\n💬 WhatsApp: +971 54 232 3854\n📧 Email: info@sharjahapproval.com\n\n📍 10th Floor, City Gate Tower\nAl Ittihad Street, Sharjah, UAE\n\n🕐 Mon-Fri: 9 AM - 6 PM',
      follow: ['Our Services', 'Get a Quote']
    },

    // About
    {
      keys: ['about', 'who are you', 'company', 'tell me about', 'what is sharjah approval'],
      reply: '🏢 About Sharjah Approval:\n\nWe are Sharjah\'s #1 authority approval consultancy with 15+ years of experience.\n\n✅ 500+ projects completed\n✅ 98% approval success rate\n✅ 20+ services offered\n✅ Expert team of consultants\n✅ Government relationships\n\nWe handle all types of government approvals so you can focus on your business!',
      follow: ['Our Services', 'How It Works', 'Contact Us']
    },

    // Process / How it works
    {
      keys: ['process', 'how it works', 'how does it work', 'steps', 'procedure', 'start', 'get started', 'begin'],
      reply: '📝 How It Works (4 Simple Steps):\n\n1️⃣ Free Consultation\nWe assess your requirements and recommend the best approach.\n\n2️⃣ Document Preparation\nOur team prepares and verifies all paperwork.\n\n3️⃣ Authority Submission\nWe submit and follow up with government departments.\n\n4️⃣ Approval Delivery\nYou receive your approved documents with full summary.\n\n📞 Start with a free consultation: +971 6 561 0096',
      follow: ['Get a Quote', 'Required Documents', 'Our Services']
    },

    // Success rate
    {
      keys: ['success rate', 'guarantee', 'guaranteed', 'approval rate', 'reject', 'rejection'],
      reply: '✅ Our Success Rate: 98%\n\nWe maintain an exceptional 98% approval success rate across all services.\n\nHow we achieve this:\n• Thorough document preparation\n• Compliance verification before submission\n• Deep understanding of authority requirements\n• Established government relationships\n\nIn rare cases of challenges, we proactively address issues and resubmit at no extra cost.',
      follow: ['Our Services', 'How It Works', 'Get a Quote']
    },

    // Do I need to visit
    {
      keys: ['need to visit', 'come to office', 'in person', 'myself', 'do i need to go', 'visit government'],
      reply: '🏠 No Office Visit Needed!\n\nIn most cases, you do NOT need to visit any government office. We handle:\n\n✅ Document collection & preparation\n✅ Government office submissions\n✅ Follow-ups with authorities\n✅ Approved document delivery\n\nYou can manage everything via phone, email, or WhatsApp!\n\n📞 +971 6 561 0096\n💬 +971 54 232 3854',
      follow: ['How It Works', 'Get a Quote', 'Our Services']
    },

    // Areas served
    {
      keys: ['area', 'sharjah only', 'dubai', 'abu dhabi', 'ajman', 'which emirate', 'coverage'],
      reply: '📍 Service Coverage:\n\nWe primarily serve the Sharjah Emirate, covering all areas including:\n\n• Sharjah City\n• Al Nahda & Al Qasimia\n• Al Khan & Al Majaz\n• Industrial Areas\n• Sharjah Free Zones\n• All Sharjah suburbs\n\nFor Dubai or Abu Dhabi approvals, contact us and we can guide you to our partner offices.',
      follow: ['Our Services', 'Contact Us', 'Get a Quote']
    },

    // Consultation
    {
      keys: ['consultation', 'free consultation', 'book', 'appointment', 'schedule', 'meeting'],
      reply: '📅 Book a Free Consultation!\n\nGet expert advice on your approval requirements at no cost.\n\n📞 Call: +971 6 561 0096\n💬 WhatsApp: +971 54 232 3854\n📧 Email: info@sharjahapproval.com\n\nOr visit our contact page to submit an inquiry form.\n\n🕐 Available Mon-Fri, 9 AM - 6 PM',
      follow: ['Our Services', 'How It Works']
    }
  ];

  // Follow-up button label → topic key mapping
  var followMap = {
    'Our Services': 'service',
    'All Services': 'service',
    'Get a Quote': 'price',
    'Contact Us': 'contact',
    'View Timelines': 'timeline',
    'Required Documents': 'document',
    'How It Works': 'process',
    'Municipality': 'municipality',
    'Civil Defense': 'civil defense',
    'SEWA': 'sewa',
    'Etisalat NOCs': 'etisalat',
    'du NOCs': 'du noc',
    'SEDD Licensing': 'sedd',
    'SAIF Zone': 'saif zone',
    'HFZA': 'hamriyah',
    'SRTIP': 'srtip',
    'Shams Media City': 'shams',
    'Health Authority': 'health authority',
    'Commerce & Tourism': 'commerce',
    'Ports Authority': 'port',
    'Ministry of Energy': 'ministry of energy',
    'Developer NOCs': 'developer noc'
  };

  // Find best matching topic
  function findReply(input) {
    var lower = input.toLowerCase();
    for (var i = 0; i < topics.length; i++) {
      var t = topics[i];
      for (var j = 0; j < t.keys.length; j++) {
        if (lower.indexOf(t.keys[j]) !== -1) {
          return t;
        }
      }
    }
    return null;
  }

  // Show typing indicator
  function showTyping() {
    var c = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.id = 'typingIndicator';
    d.className = 'chatbot-msg-row';
    d.innerHTML = '<div class="chatbot-avatar">SA</div><div class="chatbot-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  // Add user message to chat
  function addUserMsg(text) {
    var c = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'chatbot-msg-row chatbot-msg-user';
    d.innerHTML = '<div class="chatbot-bubble-user">' + escapeHtml(text) + '</div>';
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }

  // Add bot message with optional follow-up buttons
  function addBotMsg(text, followUps) {
    hideTyping();
    var c = document.getElementById('chatMessages');
    var d = document.createElement('div');
    d.className = 'chatbot-msg-row';
    var html = '<div class="chatbot-avatar">SA</div><div class="chatbot-bubble"><p>' + text.replace(/\n/g, '<br>') + '</p>';
    if (followUps && followUps.length > 0) {
      html += '<div class="chatbot-follow-btns">';
      for (var i = 0; i < followUps.length; i++) {
        html += '<button class="chatbot-follow-btn" data-query="' + escapeHtml(followUps[i]) + '">' + escapeHtml(followUps[i]) + '</button>';
      }
      html += '</div>';
    }
    html += '</div>';
    d.innerHTML = html;
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;

    // Bind follow-up button clicks
    var btns = d.querySelectorAll('.chatbot-follow-btn');
    for (var b = 0; b < btns.length; b++) {
      btns[b].addEventListener('click', function () {
        var q = this.getAttribute('data-query');
        handleFollowUp(q);
      });
    }
  }

  // Handle follow-up button click
  function handleFollowUp(label) {
    var query = followMap[label] || label;
    addUserMsg(label);
    showTyping();
    setTimeout(function () {
      var topic = findReply(query);
      if (topic) {
        addBotMsg(topic.reply, topic.follow);
      } else {
        addBotMsg(getDefault(), []);
      }
    }, 600);
  }

  // Default reply
  function getDefault() {
    return "I'm not sure about that. Here are some things I can help with:\n\n📋 Our services\n💰 Pricing info\n⏱️ Timelines\n📄 Required documents\n📞 Contact details\n📍 Office location\n\nOr click below to chat with our team directly on WhatsApp!";
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // Toggle chatbot popup
  window.toggleChatbot = function () {
    var p = document.getElementById('chatbotPopup');
    if (p.style.display === 'none' || p.style.display === '') {
      p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  };

  // Send message from input
  window.sendMessage = function () {
    var input = document.getElementById('chatInput');
    var msg = input.value.trim();
    if (!msg) return;
    addUserMsg(msg);
    input.value = '';
    showTyping();
    setTimeout(function () {
      var topic = findReply(msg);
      if (topic) {
        addBotMsg(topic.reply, topic.follow);
      } else {
        addBotMsg(getDefault(), ['Our Services', 'Contact Us', 'Get a Quote']);
      }
    }, 800);
  };

  // Quick reply buttons
  window.sendQuickReply = function (label) {
    handleFollowUp(label);
  };
})();
