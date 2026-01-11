# Claude Usage Tracker

A Chrome extension that provides visual feedback on your Claude.ai usage efficiency with color-coded indicators showing whether you're pacing your usage optimally.

## Features

- **Visual Usage Indicators**: Circular progress indicators show your usage efficiency at a glance
- **Color-Coded Feedback**:
  - **Green**: Usage below expected - you have room to use more Claude!
  - **Yellow**: On track - your usage is perfectly paced
  - **Red**: Usage above expected - consider pacing yourself
- **Dark Mode Support**: Automatically adapts to your system's color scheme
- **Privacy First**: All processing happens locally - no data leaves your browser

## Installation

### From Chrome Web Store (Recommended)
1. Visit the [Claude Usage Tracker](https://chrome.google.com/webstore) on Chrome Web Store
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/claude-usage-tracker.git
   cd claude-usage-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

1. Install the extension
2. Navigate to your Claude.ai account: [claude.ai/settings/usage](https://claude.ai/settings/usage)
3. The usage efficiency indicator will appear on the page
4. Hover over the indicator for detailed information

## How It Works

The extension calculates your usage efficiency by comparing your actual usage to the expected usage based on the current time of day. This helps you understand if you're pacing your Claude usage optimally throughout your billing period.

### Indicator States

| Color | Delta | Meaning |
|-------|-------|---------|
| Green | Below -10% | You're using less than expected - feel free to use more! |
| Yellow | -10% to +10% | You're right on track with optimal pacing |
| Red | Above +10% | Usage is higher than expected - consider pacing |

## Development

### Prerequisites
- Node.js 18 or higher
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development build (with watch mode)
npm run dev

# Run type checking
npm run type-check

# Run tests
npm test
```

### Building for Production
```bash
# Build the extension
npm run build

# Package for Chrome Web Store
npm run package
```

### Generate Icons
```bash
# Convert SVG icons to PNG
npm run generate-icons
```

### Project Structure
```
claude-usage-tracker/
├── public/
│   ├── manifest.json      # Extension manifest
│   ├── content.css        # Injected styles
│   └── icons/             # Extension icons
├── src/
│   ├── components/        # UI components
│   ├── content/           # Content script entry
│   ├── styles/            # Component styles
│   └── utils/             # Utility functions
├── scripts/
│   └── generate-icons.js  # Icon generation script
├── promotional/           # Chrome Web Store materials
├── dist/                  # Build output
└── tests/                 # Test files
```

## Privacy

Claude Usage Tracker is designed with privacy as a core principle:

- **No data collection**: We don't collect any personal information
- **Local processing**: All calculations happen in your browser
- **No external requests**: The extension never contacts external servers
- **No analytics**: We don't track how you use the extension

For complete details, see our [Privacy Policy](PRIVACY_POLICY.md).

## Permissions

The extension requires minimal permissions:

- `activeTab`: Access the current tab when on Claude.ai
- `scripting`: Inject the indicator UI on the usage page
- `https://claude.ai/*`: Only operates on Claude.ai pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/claude-usage-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/claude-usage-tracker/discussions)

## Changelog

### v1.0.0
- Initial release
- Circular usage efficiency indicators
- Color-coded feedback (green/yellow/red)
- Dark mode support
- Privacy-focused design

---

Made with care for the Claude.ai community
